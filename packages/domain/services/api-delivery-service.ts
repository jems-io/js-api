import { ApiRuntimeContext } from "../models";

export interface ApiDeliveryService {
  start(
    apiRuntimeContext: ApiRuntimeContext,
    parameters?: { [param: string]: any }
  ): Promise<void>;

  stop(): Promise<void>;
}
