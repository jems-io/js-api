import { ApiRequest } from "./api-request";

export type ApiRoutine<OutputType>  = ApiRoutineSync<OutputType> | ApiRoutineAsync<OutputType>
export type ApiRoutineSync<OutputType>  = (request: ApiRequest) => OutputType
export type ApiRoutineAsync<OutputType>  = (request: ApiRequest) => Promise<OutputType>