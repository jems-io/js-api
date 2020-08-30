import {BuiltinResourceActionPipelineService} from './builtin-resource-action-pipeline-service';
import {
  getApiMockRunOneAction, getApiMockRunOneActionWithMultipleResources,
  MockApi,
  MockApiCrashOnDeepMiddleware,
  MockApiCrashOnFirstMiddleware,
  MockApiRequest,
} from '../__mocks__';

describe('Resource Action Pipeline Service Test', () => {

  test('Api must be defined', async () => {
    const service = new BuiltinResourceActionPipelineService();

    await expect(
      service.pipe('', MockApiRequest),
    ).rejects.toThrowError('Api must be defined');
  });
  test('Action Id must be defined', async () => {
    const service = new BuiltinResourceActionPipelineService();

    service.useApi(MockApi);
    await expect(
      service.pipe('', MockApiRequest),
    ).rejects.toThrowError('Action Id must be defined');
  });
  test('Action with id was not found', async () => {
    const service = new BuiltinResourceActionPipelineService();

    service.useApi(MockApi);
    await expect(
      service.pipe('${actionId}', MockApiRequest),
    ).rejects.toThrowError('Action with id ${actionId} was not found');
  });

  test('Action with id was not found', async () => {
    const service = new BuiltinResourceActionPipelineService();

    service.useApi(MockApi);
    await expect(
      service.pipe('${actionId}', MockApiRequest),
    ).rejects.toThrowError('Action with id ${actionId} was not found');
  });

  test('Run single action', async () => {
    const service = new BuiltinResourceActionPipelineService();
    let actionRun = false;
    service.useApi(getApiMockRunOneAction((actionAlias: string) => {
      actionRun = true;
    }));
    await service.pipe('projects/vaults/query', MockApiRequest);
    await expect(
      actionRun,
    ).toBeTruthy();
  });
  test('Run single action, crash on middleware', async () => {
    const service = new BuiltinResourceActionPipelineService();
    let actionRun = false;
    service.useApi(getApiMockRunOneAction((actionAlias: string) => {
      actionRun = true;
    }));
    await service.pipe('projects/vaults/query', MockApiRequest);
    await expect(
      actionRun,
    ).toBeTruthy();
  });

  test('Run single action on api with multiple resources and actions, crash on middleware', async () => {
    const service = new BuiltinResourceActionPipelineService();
    const action = 'projects/vaults/query';
    let actionRun = false;
    service.useApi(getApiMockRunOneActionWithMultipleResources((actionAlias: string) => {
      actionRun = action == actionAlias;
    }));
    await service.pipe(action, MockApiRequest);
    await expect(
      actionRun,
    ).toBeTruthy();
  });

  test('Crash First Middleware', async () => {
    const service = new BuiltinResourceActionPipelineService();
    service.useApi(MockApiCrashOnFirstMiddleware);
    await expect(
      service.pipe('projects/query', MockApiRequest),
    ).rejects.toThrowError('Crash on Middleware');
  });

  test('Crash deep Middleware', async () => {
    const service = new BuiltinResourceActionPipelineService();
    service.useApi(MockApiCrashOnDeepMiddleware);
    await expect(
      service.pipe('projects/query', MockApiRequest),
    ).rejects.toThrowError('Crash on Middleware deep');
  });
});