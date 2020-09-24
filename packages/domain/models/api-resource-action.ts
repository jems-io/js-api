import { ApiResourceActionMiddleware } from "./api-resource-action-middleware";
import { ApiResourceActionType } from "./api-resource-action-type";
import { ApiResponse } from "./api-response";
import { ApiRoutine } from "./api-routine";

export interface ApiResourceAction {
    alias: string
    name: string
    type: ApiResourceActionType
    description?: string
    middlewares?: ApiResourceActionMiddleware[]
    routine: ApiRoutine<ApiResponse>
}