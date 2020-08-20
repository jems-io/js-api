import { ApiResource } from "./api-resource";
import { ApiResourceActionMiddleware } from "./api-resource-action-middleware";

export interface Api {
    name: string
    version: string
    description?: string
    resources: ApiResource[]
    resourcesActionsMiddlewares?: ApiResourceActionMiddleware[]
}