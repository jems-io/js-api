import { ApiRuntimeService, Api, ResourceActionDeliveryService, ResourceEventDeliveryService } from '@jems/api-domain'

export class BuiltInApiRuntimeService implements ApiRuntimeService {
    useApi(api: Api): Promise<void> {
        throw new Error("Method not implemented.");
    }
    useResourceActionDeliveryMechanism(api: ResourceActionDeliveryService): Promise<void> {
        throw new Error("Method not implemented.");
    }
    useResourceEventDeliveryMechanism(api: ResourceEventDeliveryService): Promise<void> {
        throw new Error("Method not implemented.");
    }
    execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}