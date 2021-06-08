import { MockApi, MockResourceActionDeliveryService } from "../__mocks__";
import { BuiltInApiRuntimeService } from "./built-in-api-runtime-service";

describe("Api Runtime Services Test", () => {
  test("Validate Api is define", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();

    await expect(apiRuntimeService.execute(undefined as any)).rejects.toThrowError(
      "Api definition is not valid."
    );
  });

  test("Register Delivery Action Service", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();
    const registryId: string = await apiRuntimeService.registerDeliveryService(
      new MockResourceActionDeliveryService()
    );
    await expect(registryId.length).toBeGreaterThan(1);
  });

  test("Unregister Delivery Action Service", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();

    const registryId: string = await apiRuntimeService.registerDeliveryService(
      new MockResourceActionDeliveryService()
    );
    await apiRuntimeService.unregisterDeliveryService(registryId);
  });

  test("Execute", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();

    await apiRuntimeService.execute(MockApi);
  });

  test("Execute Start Stop Action Delivery Service", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();

    const deliveryService = new MockResourceActionDeliveryService();
    const registryId: string = await apiRuntimeService.registerDeliveryService(
      deliveryService
    );
    await apiRuntimeService.execute(MockApi);
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterDeliveryService(registryId);
    expect(deliveryService.isStarted).toBeFalsy();
  });



  test("Unregister no register action", async () => {
    const apiRuntimeService = new BuiltInApiRuntimeService();

    const deliveryService = new MockResourceActionDeliveryService();
    await apiRuntimeService.registerDeliveryService(deliveryService);
    await apiRuntimeService.execute(MockApi);
    expect(deliveryService.isStarted).toBeTruthy();
    await apiRuntimeService.unregisterDeliveryService("test");
    expect(deliveryService.isStarted).toBeTruthy();
  });

});
