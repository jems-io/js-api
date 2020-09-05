import {
  ApiRequest,
  ApiResourceActionProtected,
  ApiResourceProtected, ApiResponseStatus,
  ApiRuntimeContext,
  ResourceActionDeliveryService,
} from '@jems/api-domain';
import express from 'express';
import uuid from 'uuid';
import {singularize} from '../utilities';

export class ExpressActionDeliveryService implements ResourceActionDeliveryService {
  expressApp = express();
  apiRuntimeContext?: ApiRuntimeContext;

  async start(apiRuntimeContext: ApiRuntimeContext): Promise<void> {
    this.apiRuntimeContext = apiRuntimeContext;
    apiRuntimeContext.api.resources.forEach(resource => {
      this.startResource(resource);
    });
    return Promise.resolve(undefined);
  }

  async stop(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private startResource(resource: ApiResourceProtected, path: string = '/') {
    const currentPath = `${path}/${resource.alias}`;
    const actionTypeCount = resource.actions.reduce((map: { [type: string]: number }, action) => {
      if (!map[action.type]) {
        map[action.type] = 0;
      }
      map[action.type] = map[action.type] + 1;
      return map;
    }, {});
    resource.actions.forEach(action => {
      this.startAction(action, currentPath, actionTypeCount[action.type] > 1);
    });
    resource.resources?.forEach(res => {
      this.startResource(res, `${currentPath}/:${singularize(resource.alias)}Id`);
    });
  }

  private startAction(action: ApiResourceActionProtected, path: string, useActionAliasOnPath: boolean) {

    let paramActionId = '';
    const suffix = useActionAliasOnPath ? `/${action.alias}` : '';
    const currentPath = `${path}${suffix}`;
    switch (action.type) {
      case 'query':
        this.expressApp.get(currentPath, this.getResponseHandle(action.id, path));
        break;
      case 'get':
        paramActionId = `:${singularize(action.alias)}Id`;
        this.expressApp.get(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'create':
        this.expressApp.post(`${currentPath}`, this.getResponseHandle(action.id, path));
        break;
      case 'update':
        paramActionId = `:${singularize(action.alias)}Id`;
        this.expressApp.put(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'delete':
        paramActionId = `:${singularize(action.alias)}Id`;
        this.expressApp.delete(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'patch':
        paramActionId = `:${singularize(action.alias)}Id`;
        this.expressApp.patch(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'execute':
        this.expressApp.patch(`${path}/${action.alias}`, this.getResponseHandle(action.id, path));
        break;
    }
  }

  private getResponseHandle(actionId: string, path: string): any {
    return async (req: any, res: any) => {
      try {
        const apiRequest = this.toApiReq(path, req);
        const response = await this.apiRuntimeContext?.resourceActionPipelineService?.pipe(actionId, apiRequest);
        if (response) {
          res.status(this.toStatusCode(response.status)).send(response.payload);
        }
      } catch (error) {
        res.status(500).send({message: error.toString()});
      }
    };
  }

  private toApiReq(path: string, req: any): ApiRequest {
    return {
      id: uuid.v4(),
      resourceId: path,
      metadata: {headers: req.headers},
      parameters: req.params,
      payload: Buffer.from(req.body),
    };
  }

  private toStatusCode(status: ApiResponseStatus): number {
    let code = 500;
    switch (status) {
      case 'completed':
        return 200;
      case 'malformedRequest':
        return 400;
      case 'resourceNotFound':
        return 404;
      case 'unauthenticated':
      case 'unauthorized':
        return 401;
      case 'error':
        return 500;
    }
    return code;
  }
}