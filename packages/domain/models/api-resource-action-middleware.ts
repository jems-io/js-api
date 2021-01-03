import { ApiMiddlewareRoutine } from "./api-routine";
export interface ApiResourceActionMiddleware {
    alias: string
    name: string
    description?: string
    routine: ApiMiddlewareRoutine
}