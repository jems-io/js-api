import {
  ApiRequest,
  ApiResourceActionProtected,
  ApiResourceProtected,
  ApiResponseStatus,
  ApiRuntimeContext,
  ApiPayloadType,
  ApiDeliveryService,
} from "@jems/api-domain";
import express, { Request, Response } from "express";
import * as uuid from "uuid";
import { singularize } from "../utilities";
import { createHttpTerminator, HttpTerminator } from "http-terminator";
import * as core from "express-serve-static-core";
import cors from 'cors'

const defaultValues = {
  port: 80,
};

export class ExpressActionDeliveryService
  implements ApiDeliveryService {
  private expressApp?: core.Express;
  private apiRuntimeContext?: ApiRuntimeContext;
  private httpTerminator?: HttpTerminator;
  private hasActions = false;
  private mapActions: { [actionPathAlias: string]: string } = {};
  private parameters?: { [param: string]: any };

  async start(
    apiRuntimeContext: ApiRuntimeContext,
    parameters?: { [param: string]: any }
  ): Promise<void> {
    if (this.expressApp) {
      throw Error("Service is started");
    }
    this.apiRuntimeContext = apiRuntimeContext;
    if (apiRuntimeContext.api.resources.length === 0) {
      throw Error("Should have a least one resource");
    }
    this.expressApp = express();
    this.expressApp.use(express.json());
    this.expressApp.use(cors())
    this.hasActions = false;
    this.parameters = parameters;
    this.mapActions = {};
    apiRuntimeContext.api.resources.forEach((resource) => {
      this.startResource(resource);
    });
    if (!this.hasActions) {
      throw Error("Should have a least one action");
    }
    const server = await this.expressApp?.listen(
      parameters?.port || defaultValues.port
    );
    this.httpTerminator = createHttpTerminator({ server });
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    if (!this.httpTerminator) {
      throw Error("Service is not started");
    }
    await this.httpTerminator?.terminate();
    this.expressApp = undefined;
    this.httpTerminator = undefined;
    return Promise.resolve();
  }

  private startResource(
    resource: ApiResourceProtected,
    previousResourcePath: string = ""
  ) {
    const resourceName = singularize(resource.alias);
    const resourceBasePath = `${previousResourcePath}/${resource.alias}`;
    const resourcePath = `${resourceBasePath}/:${resourceName}Id`;
    const actionTypeCount = resource.actions.reduce(
      (map: { [type: string]: number }, action) => {
        if (!map[action.type]) {
          map[action.type] = 0;
        }
        map[action.type] = map[action.type] + 1;
        return map;
      },
      {}
    );
    resource.actions.forEach((action) => {
      this.startAction(
        action,
        resourceBasePath,
        previousResourcePath,
        actionTypeCount[action.type] > 1 && action.alias !== 'default', // TODO: make this only to relay in the action alias to be default or not
        resourceName
      );
    });
    resource.resources?.forEach((res) => {
      this.startResource(res, resourcePath);
    });
  }

  private startAction(
    action: ApiResourceActionProtected,
    resourceBasePath: string,
    previousResourcePath: string,
    useActionAliasOnPath: boolean,
    resourceName: string
  ) {
    if (this.mapActions[action.id]) {
      throw Error(
        `Two actions cannot have the same alias on the same resource, action:${action.id}`
      );
    }

    this.mapActions[action.id] = action.id;
    this.hasActions = true;
    const paramActionId = `:${this.toCamelCase(resourceName)}Id`;
    const suffix = useActionAliasOnPath ? `/${action.alias}` : "";
    const currentPath = `${resourceBasePath}${suffix}`;
    let resourceId = `${resourceBasePath}/${paramActionId}`;
    switch (action.type) {
      case "query":
        this.expressApp?.get(
          currentPath,
          this.getResponseHandle(action.id, previousResourcePath)
        );
        break;
      case "get":
        this.expressApp?.get(
          resourceId,
          this.getResponseHandle(action.id, resourceId)
        );
        break;
      case "create":
        this.expressApp?.post(
          currentPath,
          this.getResponseHandle(action.id, previousResourcePath)
        );
        break;
      case "update":
        this.expressApp?.put(
          resourceId,
          this.getResponseHandle(action.id, resourceId)
        );
        break;
      case "delete":
        this.expressApp?.delete(
          resourceId,
          this.getResponseHandle(action.id, resourceId)
        );
        break;
      case "patch":
        this.expressApp?.patch(
          resourceId,
          this.getResponseHandle(action.id, resourceId)
        );
        break;
      case "execute":
        this.expressApp?.post(
          `${resourceId}/${action.alias}`,
          this.getResponseHandle(action.id, resourceId)
        );
        break;
    }
  }

  private getResponseHandle(
    actionId: string,
    resourceId?: string
  ): (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
      try {
        let resourceWithValue = undefined;

        if (resourceId) {
          resourceWithValue = resourceId.substring(1, resourceId.length);
          for (let query of Object.keys(req.query)) {
            resourceWithValue = resourceWithValue?.replace(
              `:${query}`,
              req.params[query]
            );
          }
          for (let param of Object.keys(req.params)) {
            resourceWithValue = resourceWithValue?.replace(
              `:${param}`,
              req.params[param]
            );
          }
        }
        const apiRequest = this.toApiReq(req, actionId, resourceWithValue);
        const response = await this.apiRuntimeContext?.apiResourceActionPipelineService?.pipe(
          actionId,
          apiRequest
        );
        if (response) {
          res.contentType(this.toContentType(response.payloadType));
          res.status(this.toStatusCode(response.status)).send(response.payload);
        }
      } catch (error) {
        res
          .status(this.mapErrorStatusCode(error))
          .send({ message: error.toString() });
      }
    };
  }

  private mapErrorStatusCode(error: Error): number {
    if (this.parameters?.httpStatusCodeErrorsMap) {
      for (let statusCode of Object.keys(
        this.parameters?.httpStatusCodeErrorsMap
      )) {
        for (let errorType of this.parameters?.httpStatusCodeErrorsMap[
          statusCode
        ]) {
          if (error instanceof errorType) {
            return parseInt(statusCode) || 500;
          }
        }
      }
    }
    return 500;
  }

  private toContentType(payloadType: ApiPayloadType): string {
    switch (payloadType) {
      case "json":
        return "application/json";
      case "xml":
        return "application/xml";
      case "text":
        return "text/plain";
      case "binary":
        return "application/octet-stream";
    }
  }

  private toApiReq(req: Request, actionId: string, resourceId?: string): ApiRequest {
    return {
      id: uuid.v4(),
      actionId,
      resourceId: resourceId || "",
      metadata: ({
        ...req.headers,
      }) as any,
      parameters: { ...JSON.parse(JSON.stringify(req.query)), ...req.params },
      payload: Buffer.from(JSON.stringify(req.body || {})),
      context: {},
    };
  }

  private toStatusCode(status: ApiResponseStatus): number {
    switch (status) {
      case "completed":
        return 200;
      case "malformedRequest":
        return 400;
      case "resourceNotFound":
        return 404;
      case "unauthenticated":
      case "unauthorized":
        return 401;
      default:
        return 500;
    }
  }

  private toCamelCase(str: string) {
    const arr = str.match(/[a-z]+|\d+/gi);
    return arr && arr.map((m, i) => {
      let low = m.toLowerCase();
      if (i != 0) {
        low = low.split("").map((s, k) => (k == 0 ? s.toUpperCase() : s))
          .join('');
      }
      return low;
    }).join('');
  }
}
