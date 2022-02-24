import {
  ApiDeliveryService,
  ApiDeliveryServiceInfo,
  ApiPayloadType,
  ApiRequest,
  ApiResourceActionProtected,
  ApiResourceProtected,
  ApiResponseStatus,
  ApiRuntimeContext,
} from "@jems/api-domain";
import cors from "cors";
import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Server } from "http";
import { createHttpTerminator, HttpTerminator } from "http-terminator";
import * as uuid from "uuid";
import { singularize } from "../utilities";

const deliveryServiceName = "Http Express Delivery Service";
const deliveryServiceDescription =
  "Delivers and expose the jems declarative api through the http protocol as a RESTful Web API.";
const defaultValues = {
  port: 80,
};

export class HttpExpressDeliveryService implements ApiDeliveryService {
  private expressApp?: core.Express;
  private apiRuntimeContext?: ApiRuntimeContext;
  private httpTerminator?: HttpTerminator;
  private actionsExistanceMap: { [actionId: string]: boolean } = {};
  private parameters?: { [param: string]: any };

  async getInfo(): Promise<ApiDeliveryServiceInfo> {
    return {
      name: deliveryServiceName,
      description: deliveryServiceDescription,
    };
  }

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
    this.expressApp.use(express.raw({ type: "*/*" }));
    this.expressApp.use(cors());
    this.parameters = parameters;
    this.actionsExistanceMap = {};
    apiRuntimeContext.api.resources.forEach((resource) => {
      this.startResource(resource);
    });

    const port = parameters?.port || defaultValues.port;
    const server = await new Promise<Server>((resolve, reject) => {
      try {
        const inPromiseServer = this.expressApp?.listen(port, () => {
          if (inPromiseServer) {
            resolve(inPromiseServer);
            this.apiRuntimeContext?.apiLogService.logInfo(
              `[${deliveryServiceName}]`,
              `Start listening on port ${port}`
            );
          } else {
            reject(new Error("Express http server could not be built."));
          }
        });
      } catch (error) {
        reject(error);
      }
    });

    if (typeof parameters?.serverTimeout === "number") {
      server.setTimeout(parameters.serverTimeout);
    }

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
    previousResourceParameteredPath: string = ""
  ) {
    const resourceName = singularize(resource.alias);
    const resourceBasePath = `${previousResourceParameteredPath}/${resource.alias}`;
    const actionParamPlaceholder = `:${this.toCamelCase(resourceName)}Id`;
    const resourceParameteredPath = `${resourceBasePath}/${actionParamPlaceholder}`;

    resource.actions.forEach((action) => {
      this.startAction(
        action,
        resourceBasePath,
        resourceParameteredPath,
        previousResourceParameteredPath
      );
    });
    resource.resources?.forEach((res) => {
      this.startResource(res, resourceParameteredPath);
    });
  }

  private startAction(
    action: ApiResourceActionProtected,
    resourceBasePath: string,
    resourceParameteredPath: string,
    previousResourceParameteredPath: string
  ) {
    if (this.actionsExistanceMap[action.id]) {
      throw Error(
        `Two actions cannot have the same type and alias on the same resource, action:${action.id}`
      );
    }

    if (action.type === "execute" && !action.alias) {
      throw Error(
        `Action of type execution must contain an alias, action name ${action.name}`
      );
    }

    this.actionsExistanceMap[action.id] = true;
    const aliasSuffix = action.alias ? `/${action.alias}` : "";

    const withAliasResourceBasePath = `${resourceBasePath}${aliasSuffix}`;
    const withAliasResourceParameteredPath = `${resourceParameteredPath}${aliasSuffix}`;

    switch (action.type) {
      case "query":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as GET ${withAliasResourceBasePath}`
        );
        this.expressApp?.get(
          withAliasResourceBasePath,
          this.getResponseHandle(action.id, previousResourceParameteredPath)
        );
        break;
      case "get":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as GET ${withAliasResourceParameteredPath}`
        );
        this.expressApp?.get(
          withAliasResourceParameteredPath,
          this.getResponseHandle(action.id, resourceParameteredPath)
        );
        break;
      case "create":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as POST ${withAliasResourceBasePath}`
        );
        this.expressApp?.post(
          withAliasResourceBasePath,
          this.getResponseHandle(action.id, previousResourceParameteredPath)
        );
        break;
      case "update":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as PUT ${withAliasResourceParameteredPath}`
        );
        this.expressApp?.put(
          withAliasResourceParameteredPath,
          this.getResponseHandle(action.id, resourceParameteredPath)
        );
        break;
      case "delete":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as DELETE ${withAliasResourceParameteredPath}`
        );
        this.expressApp?.delete(
          withAliasResourceParameteredPath,
          this.getResponseHandle(action.id, resourceParameteredPath)
        );
        break;
      case "patch":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as PATCH ${withAliasResourceParameteredPath}`
        );
        this.expressApp?.patch(
          withAliasResourceParameteredPath,
          this.getResponseHandle(action.id, resourceParameteredPath)
        );
        break;
      case "execute":
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Registering ${action.id} as POST ${withAliasResourceParameteredPath}`
        );
        this.expressApp?.post(
          withAliasResourceParameteredPath,
          this.getResponseHandle(action.id, resourceParameteredPath)
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
        this.apiRuntimeContext?.apiLogService.debug(
          `[${deliveryServiceName}]`,
          `Request arrive ${req.method} ${req.path}`
        );

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
        const response =
          await this.apiRuntimeContext?.apiResourceActionPipelineService?.pipe(
            actionId,
            apiRequest
          );
        if (response) {
          res.contentType(this.toContentType(response.payloadType));
          res.status(this.toStatusCode(response.status)).send(response.payload);
        }
      } catch (error: any) {
        res
          .status(this.mapErrorStatusCode(error))
          .send({ message: error.toString() });
        this.apiRuntimeContext?.apiLogService.logError(error);
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

  private toApiReq(
    req: Request,
    actionId: string,
    resourceId?: string
  ): ApiRequest {
    const extractUrlParams = this.parameters?.extractUrlParams ?? true;
    const apiRequest = {
      id: uuid.v4(),
      actionId,
      resourceId: resourceId,
      metadata: {
        ...req.headers,
      } as any,
      parameters: { ...(req.query as any) },
      payload: req.body instanceof Buffer ? req.body : Buffer.from(""),
      context: {},
    };

    if (extractUrlParams) {
      apiRequest.parameters = { ...apiRequest.parameters, ...req.params };
    }

    return apiRequest;
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
    return (
      arr &&
      arr
        .map((m, i) => {
          let low = m.toLowerCase();
          if (i != 0) {
            low = low
              .split("")
              .map((s, k) => (k == 0 ? s.toUpperCase() : s))
              .join("");
          }
          return low;
        })
        .join("")
    );
  }
}
