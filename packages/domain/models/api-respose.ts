import { ApiResponseStatus } from "./api-respos-status";

export interface ApiResponse {
    status: ApiResponseStatus
    payload: Buffer
}