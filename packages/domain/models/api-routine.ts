import { ApiRequest } from "./api-request";
import { ApiResponse } from "./api-response";

export type ApiRoutine = ApiRoutineSync | ApiRoutineAsync;
export type ApiRoutineSync = (request: ApiRequest) => ApiResponse;
export type ApiRoutineAsync = (request: ApiRequest) => Promise<ApiResponse>;

export type ApiMiddlewareRoutine =
  | ApiMiddlewareRoutineSync
  | ApiMiddlewareRoutineAsync;
export type ApiMiddlewareRoutineSync = (
  request: ApiRequest,
  invokeNextRoutine: ApiRoutine
) => ApiResponse;
export type ApiMiddlewareRoutineAsync = (
  request: ApiRequest,
  invokeNextRoutine: ApiRoutine
) => Promise<ApiResponse>;
``;
