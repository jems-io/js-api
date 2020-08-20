import { ApiRuntimeContext } from "../models/api-runtime-context";

export interface ResourceActionDeliveryService {
    start(apiRuntimeContext: ApiRuntimeContext): Promise<void>
    stop(): Promise<void>
}