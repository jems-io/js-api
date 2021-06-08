import { ApiRequest } from "../models/api-request";
import { ApiResponse } from "../models/api-response";

export interface ApiResourceActionPipelineService {
    pipe(actionId: string, request: ApiRequest): Promise<ApiResponse>
}