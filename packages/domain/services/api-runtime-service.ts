import { Api } from "../models/api";
import { ResourceActionDeliveryService } from "./resource-action-delivery-service";
import { ResourceEventDeliveryService } from "./resource-event-delivery-servic";

export interface ApiRuntimeService {
    useApi(api: Api): Promise<void>
    useResourceActionDeliveryMechanism(api: ResourceActionDeliveryService): Promise<void>
    useResourceEventDeliveryMechanism(api: ResourceEventDeliveryService): Promise<void>
    execute(): Promise<void>
}