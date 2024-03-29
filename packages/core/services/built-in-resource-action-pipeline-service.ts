import {
  Api,
  ApiLogService,
  ApiMiddleware,
  ApiRequest,
  ApiResource,
  ApiResourceAction,
  ApiResourceActionPipelineService,
  ApiResponse,
  ApiContext as DomainApiContext
} from "@jems/api-domain";

interface ActionExecutionComponents<ApiContext> {
  middlewares: ApiMiddleware<ApiContext>[];
  resource?: ApiResource<ApiContext>;
  action?: ApiResourceAction<ApiContext>;
}
export class BuiltInApiResourceActionPipelineService<ApiContext extends DomainApiContext = DomainApiContext>
  implements ApiResourceActionPipelineService
{
  constructor(private api: Api<ApiContext>, private logService: ApiLogService) {}

  async pipe(actionId: string, request: ApiRequest<ApiContext>): Promise<ApiResponse> {
    if (!this.api) {
      throw Error("Api must be defined");
    }
    if (!actionId) {
      throw Error("Action Id must be defined");
    }

    const actionExecutionComponents =
      this.getActionExecutionComponents(actionId);

    if (!actionExecutionComponents.action) {
      throw Error(`Action with id ${actionId} was not found`);
    }

    this.logService.logInfo(
      `Api Request ${actionId}`,
      request.parameters ?? {}
    );

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
  ): ActionExecutionComponents<ApiContext> {
    const actionTypeAndPath = actionId.split(":");
    const actionType = actionTypeAndPath[0];

    return actionTypeAndPath[1].split("/").reduce<ActionExecutionComponents<ApiContext>>(
      (components, actionSection, actionSectionIndex, actionSections) => {
        let resources: ApiResource<ApiContext>[];

        if (actionSectionIndex === 0) {
          resources = this.api.resources;
        } else {
          resources = components.resource?.resources ?? [];
        }

        const toReturnComponents: ActionExecutionComponents<ApiContext> = {
          resource: components.resource,
          middlewares: components.middlewares,
        };

        const sectionResource = resources.find(
          (resource) => resource.alias === actionSection
        );

        if (sectionResource) {
          toReturnComponents.resource = sectionResource;
          toReturnComponents.middlewares.push(
            ...(sectionResource.middlewares || [])
          );
        }

        const isLastSection = actionSectionIndex === actionSections.length - 1;
        if (isLastSection && toReturnComponents.resource) {
          toReturnComponents.action = toReturnComponents.resource.actions?.find(
            (action) =>
              action.type === actionType &&
              ((!sectionResource && action.alias === actionSection) ||
                (sectionResource && !action.alias))
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
        middlewares: this.api.middlewares ? [...this.api.middlewares] : []
      }
    );
  }

  private getActionResponseWithMiddlewareChain(
    request: ApiRequest<ApiContext>,
    action: ApiResourceAction<ApiContext>,
    middlewares: ApiMiddleware<ApiContext>[],
    middlewareIndex: number
  ): ApiResponse | Promise<ApiResponse> {
    return middlewares[middlewareIndex].routine(
      request,
      async (middlewareRequest) => {
        if (middlewareIndex < middlewares.length - 1) {
          return this.getActionResponseWithMiddlewareChain(
            middlewareRequest || request,
            action,
            middlewares,
            middlewareIndex + 1
          );
        } else {
          return action.routine(middlewareRequest || request);
        }
      }
    );
  }
}
