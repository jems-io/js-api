import { ApiRuntimeContext } from "../models/api-runtime-context";

export interface ResourceEventDeliveryService {
    start(apiRuntimeContext: ApiRuntimeContext): Promise<void>
    stop(): Promise<void>
}