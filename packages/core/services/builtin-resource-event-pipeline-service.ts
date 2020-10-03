import {ResourceEventPipelineService, ApiEvent} from '@jems/api-domain';
import * as uuid from 'uuid';

export class BuiltinResourceEventPipelineService implements ResourceEventPipelineService {

  private subscriptions: { [eventId: string]: { [subscriberId: string]: (event: ApiEvent) => Promise<void> } } = {};

  async pipe(eventId: string, eventContent: ApiEvent): Promise<void> {
    await Promise.all(Object.keys(this.subscriptions[eventId] || []).map(async (subscriptionId) => {
        try {
          const handler = this.subscriptions[eventId][subscriptionId];
          await handler(eventContent);
        } catch (e) {
          console.error(e);
        }
      },
    ));
    return Promise.resolve();
  }

  async subscribeListener(eventId: string, handler: (event: ApiEvent) => Promise<void>): Promise<string> {
    const subscriptionId = uuid.v4();
    if (!this.subscriptions[eventId]) {
      this.subscriptions[eventId] = {};
    }
    this.subscriptions[eventId][subscriptionId] = handler;
    return Promise.resolve(`${eventId}/${subscriptionId}`);
  }

  async unsubscribeListener(subscriptionId: string): Promise<void> {
    const eventSubscription = subscriptionId.split('/');
    if (eventSubscription.length !== 2) {
      throw Error('Invalid subscription Id');
    }
    const event = this.subscriptions[eventSubscription[0]];
    if (!event || !event[eventSubscription[1]]) {
      throw Error('Subscription Id is not subscribed');
    }
    delete this.subscriptions[eventSubscription[0]][eventSubscription[1]];
    return Promise.resolve();
  }

}