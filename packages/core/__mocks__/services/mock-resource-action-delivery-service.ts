import {ResourceActionDeliveryService} from '../../../domain/services';
import {ApiRuntimeContext} from '../../../domain/models';

export class MockResourceActionDeliveryService implements ResourceActionDeliveryService {
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