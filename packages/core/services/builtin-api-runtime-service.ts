import { ApiRuntimeService, Api, ResourceActionDeliveryService, ResourceEventDeliveryService } from '@jems/api-domain'

export class BuiltInApiRuntimeService implements ApiRuntimeService {
    useApi(api: Api): Promise<void> {
        throw new Error("Method not implemented.");
    }
    registerResourceActionDeliveryMechanism(api: ResourceActionDeliveryService): Promise<string> {
        throw new Error("Method not implemented.");
    }
    unregisterResourceActionDeliveryMechanism(registryId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    registerResourceEventDeliveryMechanism(api: ResourceEventDeliveryService): Promise<string> {
        throw new Error("Method not implemented.");
    }
    unregisterResourceEventDeliveryMechanism(registryId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}