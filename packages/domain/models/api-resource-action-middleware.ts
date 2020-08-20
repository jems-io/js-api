import { ApiRoutine } from "./api-routine";
import { ApiRequest } from "./api-request";

export interface ApiResourceActionMiddleware {
    alias: string
    name: string
    description?: string
    routine: ApiRoutine<ApiRequest>
}