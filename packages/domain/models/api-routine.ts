import { ApiRequest } from "./api-request";
import { ApiResponse } from "./api-response";

export type ApiRoutine<RoutineContextType = any> =
  | ApiRoutineSync<RoutineContextType>
  | ApiRoutineAsync<RoutineContextType>;
export type ApiRoutineSync<RoutineContextType = any> = (
  request: ApiRequest<RoutineContextType>
) => ApiResponse;
export type ApiRoutineAsync<RoutineContextType = any> = (
  request: ApiRequest<RoutineContextType>
) => Promise<ApiResponse>;

export type ApiMiddlewareRoutine<RoutineContextType = any> =
  | ApiMiddlewareRoutineSync<RoutineContextType>
  | ApiMiddlewareRoutineAsync<RoutineContextType>;
export type ApiMiddlewareRoutineSync<RoutineContextType = any> = (
  request: ApiRequest<RoutineContextType>,
  invokeNextRoutine: ApiRoutine<RoutineContextType>
) => ApiResponse;
export type ApiMiddlewareRoutineAsync<RoutineContextType = any> = (
  request: ApiRequest<RoutineContextType>,
  invokeNextRoutine: ApiRoutine<RoutineContextType>
) => Promise<ApiResponse>;
