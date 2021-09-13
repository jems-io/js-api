import {
  Api,
  ApiContext as DomainApiContext,
  ApiDeliveryService,
  ApiLogService,
  ApiProtected,
  ApiResource,
  ApiResourceAction,
  ApiResourceProtected,
  ApiRuntimeContext,
  ApiRuntimeService,
} from "@jems/api-domain";
import * as uuid from "uuid";
import { BuiltInApiResourceActionPipelineService } from "./built-in-resource-action-pipeline-service";
import { NoOpLogService } from "./no-op-api-log-service";

const DEFAULT_CONFIGURATION: BuiltInApiRuntimeServiceConfiguration = {
  logService: new NoOpLogService(),
};

interface ApiDeliveryServiceWithParametersMap {
  [id: string]: {
    actionDeliveryService: ApiDeliveryService;
    parameters: { [paramName: string]: string };
  };
}

export interface BuiltInApiRuntimeServiceConfiguration {
  logService: ApiLogService;
}

export class BuiltInApiRuntimeService implements ApiRuntimeService {
  private readonly actionDeliveryService: ApiDeliveryServiceWithParametersMap;
  private readonly configuration: BuiltInApiRuntimeServiceConfiguration;
  constructor(
    configuration: Partial<BuiltInApiRuntimeServiceConfiguration> = {}
  ) {
    this.actionDeliveryService = {};
    this.configuration = Object.assign(
      {},
      DEFAULT_CONFIGURATION,
      configuration
    );
  }

  registerDeliveryService(
    api: ApiDeliveryService,
    parameters: { [paramName: string]: string } = {}
  ): Promise<string> {
    const registryId = uuid.v4();
    this.actionDeliveryService[registryId] = {
      actionDeliveryService: api,
      parameters,
    };
    return Promise.resolve(registryId);
  }

  async unregisterDeliveryService(registryId: string): Promise<void> {
    await this.actionDeliveryService[registryId]?.actionDeliveryService.stop();
    delete this.actionDeliveryService[registryId];
  }

  async execute<ApiContext extends DomainApiContext = DomainApiContext>(api: Api<ApiContext>): Promise<void> {
    if (!api || typeof api !== "object") {
      throw Error("Api definition is not valid.");
    }

    this.configuration.logService?.logInfo(`Starting api`);

    const registeredDelivryServicesKeys = Object.keys(
      this.actionDeliveryService
    );

    this.configuration.logService?.debug(
      `Delivery services found: ${registeredDelivryServicesKeys.length}`
    );

    const apiRuntimeContext = this.getApiRuntimeContext(api);

    await Promise.all([
      ...registeredDelivryServicesKeys.map(async (key) => {
        const deliveryService = this.actionDeliveryService[key];
        const deliveryServiceInfo =
          await deliveryService.actionDeliveryService.getInfo();

        this.configuration.logService?.debug(
          `Starting delivery service: ${deliveryServiceInfo.name}`
        );

        await deliveryService.actionDeliveryService.start(
          apiRuntimeContext,
          deliveryService.parameters
        );

        this.configuration.logService?.debug(
          `Finished starting delivery service: ${deliveryServiceInfo.name}`
        );
      }),
    ]);

    this.configuration.logService?.logInfo(`Finished starting api`);
  }

  private getApiRuntimeContext<ApiContext extends DomainApiContext = DomainApiContext>(api: Api<ApiContext>): ApiRuntimeContext {
    return {
      api: this.toApiProtected({ ...api }),
      apiResourceActionPipelineService:
        new BuiltInApiResourceActionPipelineService(
          {
            ...api,
          },
          this.configuration.logService
        ),
      apiLogService: this.configuration.logService,
    };
  }

  private toApiProtected<ApiContext extends DomainApiContext = DomainApiContext>(api: Api<ApiContext>): ApiProtected {
    const { middlewares, ...apiProtectedValues } = api;
    return {
      ...apiProtectedValues,
      resources: api.resources.map((resource) =>
        this.toApiResourceProtected(resource)
      ),
    };
  }

  private toApiResourceProtected<ApiContext extends DomainApiContext = DomainApiContext>(
    apiResource: ApiResource<ApiContext>,
    path: string = ""
  ): ApiResourceProtected {
    if (path !== "") {
      path += "/";
    }
    const currentPath = `${path}${apiResource.alias}`;
    this.configuration.logService?.debug(
      `Found resource ${apiResource.name} · ${currentPath}`
    );
    return {
      name: apiResource.name,
      alias: apiResource.alias,
      actions:
        apiResource.actions?.map((action) => {
          const actionIdSuffix = action.alias ? `/${action.alias}` : "";
          const actionId = `${action.type}:${currentPath}${actionIdSuffix}`;
          this.configuration.logService?.debug(
            `Found resource action ${action.name} · ${actionId}`
          );
          return {
            ...action,
            id: actionId,
          };
        }) ?? [],
      resources:
        apiResource.resources?.map((resource) =>
          this.toApiResourceProtected(resource, currentPath)
        ) || [],
    };
  }
}
