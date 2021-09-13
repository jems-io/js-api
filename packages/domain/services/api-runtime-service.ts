import { Api, ApiContext as DomainApiContext } from "../models";
import { ApiDeliveryService } from "./api-delivery-service";

export interface ApiRuntimeService {
  registerDeliveryService(
    api: ApiDeliveryService,
    parameters?: { [paramName: string]: string }
  ): Promise<string>;
  unregisterDeliveryService(registryId: string): Promise<void>;
  execute<ApiContext extends DomainApiContext = DomainApiContext>(api: Api<ApiContext>): Promise<void>;
}
