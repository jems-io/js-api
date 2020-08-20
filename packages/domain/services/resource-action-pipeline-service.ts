import { ApiRequest } from "../models/api-request";
import { ApiResponse } from "../models/api-respose";

export interface ResourceActionPipelineService {
    pipe(actionId: string, request: ApiRequest): Promise<ApiResponse>
}