import {ResourceActionPipelineService} from '../../domain/services';
import {
  Api,
  ApiRequest,
  ApiResource,
  ApiResourceAction,
  ApiResourceActionMiddleware,
  ApiResponse,
} from '../../domain/models';

export class BuiltinResourceActionPipelineService implements ResourceActionPipelineService {
  private api?: Api;

  useApi(api: Api) {
    this.api = api;
  }

  async pipe(actionId: string, request: ApiRequest): Promise<ApiResponse> {
    if (!this.api) {
      throw Error('Api must be defined');
    }
    if (!actionId) {
      throw Error('Action Id must be defined');
    }
    const parts = actionId.split('/');
    const firstResource = this.findFirstResource(parts[0]);
    const resourcesPath = parts.splice(1);
    const action = this.getAction([...resourcesPath], firstResource);
    if (!action) {
      throw Error(`Action with id ${actionId} was not found`);
    }
    request = await this.runMiddlewares(request, this.api.resourcesActionsMiddlewares);
    request = await this.runAllMiddlewares(resourcesPath, request, firstResource);

    const response = await action.routine(request);
    return Promise.resolve(response);
  }

  private getAction(parts: string[], resource?: ApiResource): ApiResourceAction | undefined {
    if (!resource) {
      return undefined;
    }
    if (parts.length === 1) {
      return resource.actions.filter(action => action.alias === parts[0])?.[0];
    }
    return this.getAction(parts.splice(1), this.findResource(parts[0], resource.resources));
  }

  private findFirstResource(resourceAlias: string): ApiResource | undefined {
    return this.findResource(resourceAlias, this.api?.resources);
  }

  private findResource(resourceAlias: string, resources?: ApiResource[]): ApiResource | undefined {
    return resources?.filter(resource => resource.alias === resourceAlias)?.[0];
  }

  private async runAllMiddlewares(parts: string[], request: ApiRequest, resource?: ApiResource): Promise<ApiRequest> {
    request = await this.runMiddlewares(request, resource?.actionsMiddlewares);
    if (parts.length === 1) {
      const action = resource?.actions?.filter(action => action.alias === parts[0])?.[0];
      return this.runMiddlewares(request, action?.middlewares);
    }
    return this.runAllMiddlewares(parts.splice(1), request, this.findResource(parts[0], resource?.resources));
  }

  private async runMiddlewares(request: ApiRequest, middlewares?: ApiResourceActionMiddleware[]): Promise<ApiRequest> {
    for (let middleware of middlewares || []) {
      request = await middleware.routine(request);
    }
    return Promise.resolve(request);
  }

}