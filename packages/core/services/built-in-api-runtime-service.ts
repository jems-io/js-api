import {
  Api,
  ApiDeliveryService,
  ApiProtected,
  ApiResource,
  ApiResourceAction,
  ApiResourceProtected,
  ApiRuntimeContext,
  ApiRuntimeService,
} from "@jems/api-domain";
import * as uuid from "uuid";
import { BuiltInApiResourceActionPipelineService } from "./built-in-resource-action-pipeline-service";

interface ApiDeliveryServiceWithParametersMap {
  [id: string]: {
    actionDeliveryService: ApiDeliveryService;
    parameters: { [paramName: string]: string };
  };
}

export class BuiltInApiRuntimeService implements ApiRuntimeService {
  private actionDeliveryService: ApiDeliveryServiceWithParametersMap = {};

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

    const apiRuntimeContext = this.getApiRuntimeContext(api);

    await Promise.all([
      ...Object.keys(this.actionDeliveryService).map((key) => {
        this.actionDeliveryService[key].actionDeliveryService.start(
          apiRuntimeContext,
          this.actionDeliveryService[key].parameters
        );
      }),
    ]);
  }

  private getApiRuntimeContext(api: Api): ApiRuntimeContext {
    return {
      api: this.toApiProtected({ ...api }),
      apiResourceActionPipelineService:
        new BuiltInApiResourceActionPipelineService({
          ...api,
        }),
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
    return {
      name: apiResource.name,
      alias: apiResource.alias,
      actions: apiResource.actions?.map((action: ApiResourceAction) => ({
        ...action,
        id: `${currentPath}/${action.alias}`,
      })) ?? [],
      resources:
        apiResource.resources?.map((resource: ApiResource) =>
          this.toApiResourceProtected(resource, currentPath)
        ) || [],
    };
  }
}
