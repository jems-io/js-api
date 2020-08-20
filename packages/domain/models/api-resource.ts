import { ApiResourceAction } from "./api-resource-action";
import { ApiResourceEvent } from "./api-resource-event";
import { ApiResourceActionMiddleware } from "./api-resource-action-middleware";

export interface ApiResource {
    alias: string
    name: string
    description?: string
    actions: ApiResourceAction[]
    actionsMiddlewares?: ApiResourceActionMiddleware[]
    events: ApiResourceEvent[]
    resources?: ApiResource[]
}