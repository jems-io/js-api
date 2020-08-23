import {ResourceEventPipelineService} from '../../../domain/services';
import {ApiEvent} from '../../../domain/models';
import * as uuid from 'uuid';

export class MockResourceEventPipelineService implements ResourceEventPipelineService {
  pipe(eventId: string, eventContent: ApiEvent): Promise<void> {
    return Promise.resolve();
  }

  subscribeListener(eventId: string, handler: (event: ApiEvent) => Promise<void>): Promise<string> {
    return Promise.resolve(uuid.v4());
  }

  unsubscribeListener(subscriptionId: string): Promise<void> {
    return Promise.resolve();
  }
}