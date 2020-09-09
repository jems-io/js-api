import { Api } from "../models/api";
import { ResourceActionDeliveryService } from "./resource-action-delivery-service";
import { ResourceEventDeliveryService } from "./resource-event-delivery-servic";

export interface ApiRuntimeService {
    useApi(api: Api): Promise<void>
    registerResourceActionDeliveryMechanism(api: ResourceActionDeliveryService, parameters?: { [paramName: string]: string }): Promise<string>
    unregisterResourceActionDeliveryMechanism(registryId: string): Promise<void>
    registerResourceEventDeliveryMechanism(api: ResourceEventDeliveryService): Promise<string>
    unregisterResourceEventDeliveryMechanism(registryId: string): Promise<void>
    execute(): Promise<void>
}