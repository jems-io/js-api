import {
  Api,
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
import { BuiltInLogService } from "./built-in-api-log-service";
import { BuiltInApiResourceActionPipelineService } from "./built-in-resource-action-pipeline-service";

interface ApiDeliveryServiceWithParametersMap {
  [id: string]: {
    actionDeliveryService: ApiDeliveryService;
    parameters: { [paramName: string]: string };
  };
}

export interface BuiltInApiRuntimeServiceConfiguration {
  debug: boolean;
  logService: ApiLogService;
}

export class BuiltInApiRuntimeService implements ApiRuntimeService {
  private actionDeliveryService: ApiDeliveryServiceWithParametersMap = {};
  private logService: ApiLogService;

  constructor(
    private configuration: Partial<BuiltInApiRuntimeServiceConfiguration> = {}
  ) {
    this.logService = this.configuration.logService ?? new BuiltInLogService();
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

  async execute(api: Api): Promise<void> {
    if (!api || typeof api !== "object") {
      throw Error("Api definition is not valid.");
    }

    this.logService.logInfo(`Starting api`);

    const registeredDelivryServicesKeys = Object.keys(
      this.actionDeliveryService
    );

    this.logService.debug(
      `Delivery services found: ${registeredDelivryServicesKeys.length}`
    );

    const apiRuntimeContext = this.getApiRuntimeContext(api);

    await Promise.all([
      ...registeredDelivryServicesKeys.map((key) => {
        const deliveryService = this.actionDeliveryService[key];
        this.logService.debug(
          `Starting delivery service: ${deliveryService.actionDeliveryService}`
        );

        deliveryService.actionDeliveryService.start(
          apiRuntimeContext,
          deliveryService.parameters
        );

        this.logService.debug(
          `Finished starting delivery service: ${deliveryService.actionDeliveryService}`
        );
      }),
    ]);

    this.logService.logInfo(`Finished starting api`);
  }

  private getApiRuntimeContext(api: Api): ApiRuntimeContext {
    return {
      api: this.toApiProtected({ ...api }),
      apiResourceActionPipelineService:
        new BuiltInApiResourceActionPipelineService(
          {
            ...api
          },
          this.logService
        ),
      apiLogService: this.logService,
    };
  }

  private toApiProtected(api: Api): ApiProtected {
    const { middlewares, ...apiProtectedValues } = api;
    return {
      ...apiProtectedValues,
      resources: api.resources.map((resource: ApiResource) =>
        this.toApiResourceProtected(resource)
      ),
    };
  }

  private toApiResourceProtected(
    apiResource: ApiResource,
    path: string = ""
  ): ApiResourceProtected {
    if (path !== "") {
      path += "/";
    }
    const currentPath = `${path}${apiResource.alias}`;
    this.logService.debug(
      `Found resource ${apiResource.name} · ${currentPath}`
    );
    return {
      name: apiResource.name,
      alias: apiResource.alias,
      actions:
        apiResource.actions?.map((action: ApiResourceAction) => {
          const actionIdSuffix = action.alias ? `/${action.alias}` : ''
          const actionId = `${action.type}:${currentPath}${actionIdSuffix}`;
          this.logService.debug(
            `Found resource action ${action.name} · ${actionId}`
          );
          return {
            ...action,
            id: actionId,
          };
        }) ?? [],
      resources:
        apiResource.resources?.map((resource: ApiResource) =>
          this.toApiResourceProtected(resource, currentPath)
        ) || [],
    };
  }
}
