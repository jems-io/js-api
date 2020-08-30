import {BuiltinResourceEventPipelineService} from './builtin-resource-event-pipeline-service';
import {MockApiEvent} from '../__mocks__/models/mock-api-event';
import exp from 'constants';

describe('Resource Event Pipeline Services Test', () => {
  test('Invalid subscriber id', async () => {

    const service = new BuiltinResourceEventPipelineService();
    await expect(
      service.unsubscribeListener(''),
    ).rejects.toThrowError('Invalid subscription Id');
  });
  test('Subscriber id not found', async () => {
    const service = new BuiltinResourceEventPipelineService();
    const eventId = 'eventId';
    await expect(
      service.unsubscribeListener(`${eventId}/subId`),
    ).rejects.toThrowError('Subscription Id is not subscribed');
    await service.subscribeListener(eventId, (event) => {
      return Promise.resolve();
    });
    await expect(
      service.unsubscribeListener(`${eventId}/subId`),
    ).rejects.toThrowError('Subscription Id is not subscribed');
  });
  test('Subscribe and execute event', async () => {
    const service = new BuiltinResourceEventPipelineService();
    const eventId = 'eventId';
    let subscriberExecutions = 0;
    const subscriberId = await service.subscribeListener(eventId, (event) => {
      subscriberExecutions++;
      return Promise.resolve();
    });
    await service.pipe(eventId, MockApiEvent);
    expect(subscriberExecutions).toBe(1);
    await service.unsubscribeListener(subscriberId);
    await service.pipe(eventId, MockApiEvent);
    expect(subscriberExecutions).toBe(1);
  });
  test('Run event without subscribers', async () => {
    const service = new BuiltinResourceEventPipelineService();
    const eventId = 'eventId';
    await service.pipe(eventId, MockApiEvent);
  });

  test('Subscribes and execute events', async () => {
    const service = new BuiltinResourceEventPipelineService();
    const eventId = 'eventId';
    const eventId2 = 'eventId2';
    let subscriberEvent1Executions = 0;
    let subscriberEvent2Executions = 0;
    const subscriberId = await service.subscribeListener(eventId, (event) => {
      subscriberEvent1Executions++;
      return Promise.resolve();
    });
    const subscriberId2 = await service.subscribeListener(eventId2, (event) => {
      subscriberEvent2Executions++;
      return Promise.resolve();
    });
    await service.pipe(eventId, MockApiEvent);
    expect(subscriberEvent1Executions).toBe(1);
    expect(subscriberEvent2Executions).toBe(0);
    await service.pipe(eventId2, MockApiEvent);
    expect(subscriberEvent1Executions).toBe(1);
    expect(subscriberEvent2Executions).toBe(1);
    await service.unsubscribeListener(subscriberId);
    await service.pipe(eventId, MockApiEvent);
    expect(subscriberEvent1Executions).toBe(1);
    expect(subscriberEvent2Executions).toBe(1);
    await service.pipe(eventId2, MockApiEvent);
    expect(subscriberEvent1Executions).toBe(1);
    expect(subscriberEvent2Executions).toBe(2);
    await service.unsubscribeListener(subscriberId2);
    await service.pipe(eventId, MockApiEvent);
    await service.pipe(eventId2, MockApiEvent);
    expect(subscriberEvent1Executions).toBe(1);
    expect(subscriberEvent2Executions).toBe(2);
  });
});