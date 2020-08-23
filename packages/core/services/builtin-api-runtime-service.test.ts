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
});