import {ApiRuntimeContext} from '../models/api-runtime-context';

export interface ResourceActionDeliveryService {
  start(apiRuntimeContext: ApiRuntimeContext, parameters?: { [param: string]: string }): Promise<void>

  stop(): Promise<void>
}