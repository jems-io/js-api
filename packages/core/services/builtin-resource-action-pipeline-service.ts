import {
  ResourceActionPipelineService,
  Api,
  ApiRequest,
  ApiResource,
  ApiResourceAction,
  ApiResourceActionMiddleware,
  ApiResponse,
} from "@jems/api-domain";

interface ActionExecutionComponents {
  middlewares: ApiResourceActionMiddleware[];
  resource?: ApiResource;
  action?: ApiResourceAction;
}
export class BuiltinResourceActionPipelineService
  implements ResourceActionPipelineService {
  constructor(private api: Api) {}

  async pipe(actionId: string, request: ApiRequest): Promise<ApiResponse> {
    if (!this.api) {
      throw Error("Api must be defined");
    }
    if (!actionId) {
      throw Error("Action Id must be defined");
    }

    const actionExecutionComponents = this.getActionExecutionComponents(
      actionId
    );

    if (!actionExecutionComponents.action) {
      throw Error(`Action with id ${actionId} was not found`);
    }

    if (!actionExecutionComponents.middlewares.length) {
      return await actionExecutionComponents.action.routine(request);
    } else {
      return await this.getActionResponseWithMiddlewareChain(
        request,
        actionExecutionComponents.action,
        actionExecutionComponents.middlewares,
        0
      );
    }
  }

  private getActionExecutionComponents(
    actionId: string
  ): ActionExecutionComponents {
    return actionId.split("/").reduce<ActionExecutionComponents>(
      (components, actionSection, actionSectionIndex, actionSections) => {
        let resources: ApiResource[] | undefined;

        if (actionSectionIndex === 0) {
          resources = this.api.resources;
        } else {
          resources = components.resource?.resources;
        }

        const toReturnComponents: ActionExecutionComponents = {
          middlewares: components.middlewares,
        };

        if (resources && actionSectionIndex < actionSections.length - 1) {
          toReturnComponents.resource = resources?.find(
            (resource) => resource.alias === actionSection
          );
        }

        if (
          actionSectionIndex === actionSections.length - 1 &&
          components.resource
        ) {
          toReturnComponents.middlewares.push(
            ...(components.resource.actionsMiddlewares || [])
          );
          toReturnComponents.action = components.resource.actions.find(
            (action) => action.alias === actionSection
          );

          if (toReturnComponents.action) {
            toReturnComponents.middlewares.push(
              ...(toReturnComponents.action?.middlewares || [])
            );
          }
        }

        return toReturnComponents;
      },
      {
        middlewares: this.api.resourcesActionsMiddlewares || [],
      }
    );
  }

  private getActionResponseWithMiddlewareChain(
    request: ApiRequest,
    action: ApiResourceAction,
    middlewares: ApiResourceActionMiddleware[],
    middlewareIndex: number
  ): ApiResponse | Promise<ApiResponse> {
    return middlewares[middlewareIndex].routine(request, async middlewareRequest => {
      if (middlewareIndex < (middlewares.length - 1)) {
        return this.getActionResponseWithMiddlewareChain(
          middlewareRequest || request,
          action,
          middlewares,
          middlewareIndex + 1
        );
      } else {
        return action.routine(middlewareRequest || request);
      }
    });
  }
}
