import {
  getApiMockRunOneAction,
  getApiMockRunOneActionWithMultipleResources,
  MockApi,
  MockApiCrashOnDeepMiddleware,
  MockApiCrashOnFirstMiddleware,
  MockApiRequest,
} from "../__mocks__";
import { BuiltInApiResourceActionPipelineService } from "./built-in-resource-action-pipeline-service";

describe("Resource Action Pipeline Service Test", () => {
  test("Api must be defined", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      undefined as any
    );

    await expect(service.pipe("", MockApiRequest)).rejects.toThrowError(
      "Api must be defined"
    );
  });
  test("Action Id must be defined", async () => {
    const service = new BuiltInApiResourceActionPipelineService(MockApi);

    await expect(service.pipe("", MockApiRequest)).rejects.toThrowError(
      "Action Id must be defined"
    );
  });
  test("Action with id was not found on resource", async () => {
    const service = new BuiltInApiResourceActionPipelineService(MockApi);

    await expect(
      service.pipe("${actionId}", MockApiRequest)
    ).rejects.toThrowError("Action with id ${actionId} was not found");
  });

  test("Action with id was not found", async () => {
    const service = new BuiltInApiResourceActionPipelineService(MockApi);

    const actionId = "projects/vaults/update_vault";
    await expect(service.pipe(actionId, MockApiRequest)).rejects.toThrowError(
      `Action with id ${actionId} was not found`
    );
  });

  test("Action with id was not found", async () => {
    const service = new BuiltInApiResourceActionPipelineService(MockApi);

    await expect(
      service.pipe("${actionId}", MockApiRequest)
    ).rejects.toThrowError("Action with id ${actionId} was not found");
  });

  test("Run single action", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      getApiMockRunOneAction((actionAlias: string) => {
        actionRun = true;
      })
    );
    let actionRun = false;
    await service.pipe("projects/vaults/query", MockApiRequest);
    await expect(actionRun).toBeTruthy();
  });
  test("Run single action, crash on middleware", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      getApiMockRunOneAction((actionAlias: string) => {
        actionRun = true;
      })
    );
    let actionRun = false;
    await service.pipe("projects/vaults/query", MockApiRequest);
    await expect(actionRun).toBeTruthy();
  });

  test("Run single action on api with multiple resources and actions, crash on middleware", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      getApiMockRunOneActionWithMultipleResources((actionAlias: string) => {
        actionRun = action == actionAlias;
      })
    );
    const action = "projects/vaults/query";
    let actionRun = false;
    await service.pipe(action, MockApiRequest);
    await expect(actionRun).toBeTruthy();
  });

  test("Crash First Middleware", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      MockApiCrashOnFirstMiddleware
    );
    await expect(
      service.pipe("projects/query", MockApiRequest)
    ).rejects.toThrowError("Crash on Middleware");
  });

  test("Crash deep Middleware", async () => {
    const service = new BuiltInApiResourceActionPipelineService(
      MockApiCrashOnDeepMiddleware
    );
    await expect(
      service.pipe("projects/query", MockApiRequest)
    ).rejects.toThrowError("Crash on Middleware deep");
  });
});
