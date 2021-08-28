import { Api, ApiContext } from "../models";
import { ApiDeliveryService } from "./api-delivery-service";

export interface ApiRuntimeService {
  registerDeliveryService(
    api: ApiDeliveryService,
    parameters?: { [paramName: string]: string }
  ): Promise<string>;
  unregisterDeliveryService(registryId: string): Promise<void>;
  execute(api: Api): Promise<void>;
}
