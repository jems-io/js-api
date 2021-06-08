import { ApiDeliveryService } from "@jems/api-domain";
import { ApiRuntimeContext } from "@jems/api-domain/models";

export class MockDeliveryService implements ApiDeliveryService {
  isStarted: boolean = false;

  start(apiRuntimeContext: ApiRuntimeContext): Promise<void> {
    this.isStarted = true;
    return Promise.resolve(undefined);
  }

  stop(): Promise<void> {
    this.isStarted = false;
    return Promise.resolve(undefined);
  }
}
