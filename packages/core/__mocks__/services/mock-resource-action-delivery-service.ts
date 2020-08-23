import {ResourceActionDeliveryService} from '../../../domain/services';
import {ApiRuntimeContext} from '../../../domain/models';

export class MockResourceActionDeliveryService implements ResourceActionDeliveryService{
  start(apiRuntimeContext: ApiRuntimeContext): Promise<void> {
    return Promise.resolve(undefined);
  }

  stop(): Promise<void> {
    return Promise.resolve(undefined);
  }

}