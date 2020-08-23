import {ResourceEventDeliveryService} from '../../../domain/services';
import {ApiRuntimeContext} from '../../../domain/models';

export class MockResourceEventDeliveryService implements ResourceEventDeliveryService {
  start(apiRuntimeContext: ApiRuntimeContext): Promise<void> {
    return Promise.resolve(undefined);
  }

  stop(): Promise<void> {
    return Promise.resolve(undefined);
  }

}