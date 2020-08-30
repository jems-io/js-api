import {BuiltInApiRuntimeService} from './builtin-api-runtime-service';
import {
  MockApi,
  MockResourceActionDeliveryService,
  MockResourceActionPipelineService, MockResourceEventDeliveryService,
  MockResourceEventPipelineService,
} from '../__mocks__';

describe('Api Runtime Services Test', () => {
  test('Validate Api is define', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await expect(
      apiRuntimeService.execute(),
    ).rejects.toThrowError('Api must be define');
  });

  test('Register Delivery Action Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceActionDeliveryMechanism(new MockResourceActionDeliveryService());
    await expect(
      registryId.length,
    ).toBeGreaterThan(1);
  });

  test('Unregister Delivery Action Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceActionDeliveryMechanism(new MockResourceActionDeliveryService());
    await apiRuntimeService.unregisterResourceActionDeliveryMechanism(registryId);
  });

  test('Register Delivery Event Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceEventDeliveryMechanism(new MockResourceEventDeliveryService());
    await expect(
      registryId.length,
    ).toBeGreaterThan(1);
  });

  test('Unregister Delivery Event Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceEventDeliveryMechanism(new MockResourceEventDeliveryService());
    await apiRuntimeService.unregisterResourceEventDeliveryMechanism(registryId);
  });

  test('Execute', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    await apiRuntimeService.useApi(MockApi);
    await apiRuntimeService.execute();
  });

  test('Execute Start Stop Action Delivery Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    const deliveryService = new MockResourceActionDeliveryService();
    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceActionDeliveryMechanism(deliveryService);
    await apiRuntimeService.execute();
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterResourceActionDeliveryMechanism(registryId);
    expect(deliveryService.isStarted).toBeFalsy();
  });

  test('Execute Start Stop Event Delivery Service', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    const deliveryService = new MockResourceEventDeliveryService();
    await apiRuntimeService.useApi(MockApi);
    const registryId: string = await apiRuntimeService.registerResourceEventDeliveryMechanism(deliveryService);
    await apiRuntimeService.execute();
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterResourceEventDeliveryMechanism(registryId);
    expect(deliveryService.isStarted).toBeFalsy();
  });


  test('Unregister no register action', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    const deliveryService = new MockResourceActionDeliveryService();
    await apiRuntimeService.useApi(MockApi);
    await apiRuntimeService.registerResourceActionDeliveryMechanism(deliveryService);
    await apiRuntimeService.execute();
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterResourceActionDeliveryMechanism('test');
    expect(deliveryService.isStarted).toBeTruthy();
  });


  test('Unregister no register event', async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService(new MockResourceActionPipelineService(), new MockResourceEventPipelineService());

    const deliveryService = new MockResourceEventDeliveryService();
    await apiRuntimeService.useApi(MockApi);
    await apiRuntimeService.registerResourceEventDeliveryMechanism(deliveryService);
    await apiRuntimeService.execute();
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterResourceEventDeliveryMechanism('test');
    expect(deliveryService.isStarted).toBeTruthy();
  });
});