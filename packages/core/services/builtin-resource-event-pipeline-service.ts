import {ResourceEventPipelineService} from '../../domain/services';
import {ApiEvent} from '../../domain/models';

export class BuiltinResourceEventPipelineService implements ResourceEventPipelineService {

  pipe(eventId: string, eventContent: ApiEvent): Promise<void> {
    return Promise.resolve(undefined);
  }

  subscribeListener(eventId: string, handler: (event: ApiEvent) => Promise<void>): Promise<string> {
    return Promise.resolve('');
  }

  unsubscribeListener(subscriptionId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

}