import { ApiResource } from "./api-resource";
import { ApiResourceActionMiddleware } from "./api-resource-action-middleware";

export interface ApiProtected { // TODO: Remove routines
    name: string
    version: string
    description?: string
    resources: ApiResource[]
    resourcesActionsMiddlewares?: ApiResourceActionMiddleware[]
}