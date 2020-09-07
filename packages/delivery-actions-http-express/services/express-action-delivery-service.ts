import {
  ApiRequest,
  ApiResourceActionProtected,
  ApiResourceProtected, ApiResponseStatus,
  ApiRuntimeContext,
  ResourceActionDeliveryService,
} from '@jems/api-domain';
import express, {Request, Response} from 'express';
import * as uuid from 'uuid';
import {singularize} from '../utilities';
import {
  createHttpTerminator, HttpTerminator,
} from 'http-terminator';
import * as core from 'express-serve-static-core';

// TODO: Questions::
// Why the api context protected has the event service??
// Should this class only run multiple instance of APIs?

export class ExpressActionDeliveryService implements ResourceActionDeliveryService {
  private expressApp?: core.Express;
  private apiRuntimeContext?: ApiRuntimeContext;
  private httpTerminator?: HttpTerminator;
  private hasActions = false;

  async start(apiRuntimeContext: ApiRuntimeContext): Promise<void> {
    this.apiRuntimeContext = apiRuntimeContext;
    if (apiRuntimeContext.api.resources.length === 0) {
      throw Error('Should have a least one resource');
    }
    this.expressApp = express();
    this.expressApp.use(express.json());
    this.hasActions = false;
    apiRuntimeContext.api.resources.forEach(resource => {
      this.startResource(resource);
    });
    if (!this.hasActions) {
      throw Error('Should have a least one action');
    }
    const server = await this.expressApp?.listen(3000);
    this.httpTerminator = createHttpTerminator({server});
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    if (!this.httpTerminator) {
      throw Error('Service is not started');
    }
    await this.httpTerminator?.terminate();
    this.expressApp = undefined;
    this.httpTerminator = undefined;
    return Promise.resolve();
  }

  private startResource(resource: ApiResourceProtected, path: string = '') {
    const currentPath = `${path}/${resource.alias}`;
    const resourceName = singularize(resource.alias);
    const actionTypeCount = resource.actions.reduce((map: { [type: string]: number }, action) => {
      if (!map[action.type]) {
        map[action.type] = 0;
      }
      map[action.type] = map[action.type] + 1;
      return map;
    }, {});
    resource.actions.forEach(action => {
      this.startAction(action, currentPath, actionTypeCount[action.type] > 1, resourceName);
    });
    resource.resources?.forEach(res => {
      this.startResource(res, `${currentPath}/:${resourceName}Id`);
    });
  }

  private startAction(action: ApiResourceActionProtected, path: string, useActionAliasOnPath: boolean, resourceName: string) {
    this.hasActions = true;
    const paramActionId = `:${resourceName}Id`;
    const suffix = useActionAliasOnPath ? `/${action.alias}` : '';
    const currentPath = `${path}${suffix}`;
    switch (action.type) {
      case 'query':
        this.expressApp?.get(currentPath, this.getResponseHandle(action.id, path));
        break;
      case 'get':
        this.expressApp?.get(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'create':
        this.expressApp?.post(currentPath, this.getResponseHandle(action.id, path));
        break;
      case 'update':
        this.expressApp?.put(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'delete':
        this.expressApp?.delete(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'patch':
        this.expressApp?.patch(`${currentPath}/${paramActionId}`, this.getResponseHandle(action.id, path));
        break;
      case 'execute':
        this.expressApp?.get(`${path}/${paramActionId}/${action.alias}`, this.getResponseHandle(action.id, path));
        break;
    }
  }

  private getResponseHandle(actionId: string, path: string): any {
    return async (req: Request, res: Response) => {
      try {
        const apiRequest = this.toApiReq(path, req);
        const response = await this.apiRuntimeContext?.resourceActionPipelineService?.pipe(actionId, apiRequest);
        if (response) {
          const jsonResponse = response.payload.toString('utf8');
          res.contentType('application/json');
          res.status(this.toStatusCode(response.status)).send(jsonResponse);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({message: error.toString()});
      }
    };
  }

  private toApiReq(path: string, req: Request): ApiRequest {
    return {
      id: uuid.v4(),
      resourceId: path,
      metadata: {
        headers: req.headers,
        cookies: req.cookies,
      },
      parameters: {...JSON.parse(JSON.stringify(req.query)), ...req.params},
      payload: Buffer.from(JSON.stringify(req.body || {})),
    };
  }

  private toStatusCode(status: ApiResponseStatus): number {
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
      default:
        return 500;
    }
  }
}