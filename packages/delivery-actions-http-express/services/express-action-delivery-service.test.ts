import {ExpressActionDeliveryService} from './express-action-delivery-service';
import {
  MockApiActionRepeated,
  MockApiError,
  MockApiRealApi,
  MockApiRuntimeContextWithoutActions,
  MockApiRuntimeContextWithoutResources,
  MockResourceEventPipelineService,
} from '../__mocks__';
import {ApiRuntimeContext} from '@jems/api-domain';
import fetch from 'node-fetch';
import {BuiltInApiRuntimeService, BuiltinResourceActionPipelineService} from '../../core/services';

const actionPipelineService = new BuiltinResourceActionPipelineService();
actionPipelineService.useApi(MockApiRealApi);

describe('Express Action Delivery Service Test', () => {
  test('Start without resource', async () => {
    const service = new ExpressActionDeliveryService();
    await expect(
      service.start(MockApiRuntimeContextWithoutResources),
    ).rejects.toThrowError('Should have a least one resource');
  });
  test('Start without actions', async () => {
    const service = new ExpressActionDeliveryService();
    await expect(
      service.start(MockApiRuntimeContextWithoutActions),
    ).rejects.toThrowError('Should have a least one action');
  });
  test('Stop without starts', async () => {
    const service = new ExpressActionDeliveryService();
    await expect(
      service.stop(),
    ).rejects.toThrowError('Service is not started');
  });
  test('Start Stop', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    await service.stop();
    await expect(
      fetch('http://localhost/projects'),
    ).rejects.toThrowError('request to http://localhost/projects failed, reason: connect ECONNREFUSED 127.0.0.1');
  });
  test('Query Method - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects');
    const json = await res.json();
    expect(
      res.status,
    ).toBe(200);
    expect(
      json.data.length,
    ).toBe(0);
    await service.stop();
  });
  test('Query Method - unauthorized', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects?errorCode=unauthorized');
    const json = await res.json();
    expect(
      res.status,
    ).toBe(401);
    expect(
      json.data,
    ).toBe(undefined);
    await service.stop();
  });
  test('Get By Id - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/123312');
    const json = await res.json();
    expect(
      res.status,
    ).toBe(200);
    expect(
      json.data.length,
    ).toBe(0);
    await service.stop();
  });
  test('Create - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const body = {name: 'test'};
    const res = await fetch('http://localhost/projects', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
    });
    const json = await res.json();
    expect(
      res.status,
    ).toBe(200);
    expect(
      json.request.payload.name,
    ).toBe(body.name);
    await service.stop();
  });

  test('Update - malformedRequest', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/1232?errorCode=malformedRequest', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
    });
    expect(
      res.status,
    ).toBe(400);
    await service.stop();
  });

  test('Path - resourceNotFound', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/1232?errorCode=resourceNotFound', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
    });
    expect(
      res.status,
    ).toBe(404);
    await service.stop();
  });
  test('Execute - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/*/sync_project', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });
    const json = await res.json();
    expect(
      res.status,
    ).toBe(200);
    expect(
      json.request.parameters.projectId,
    ).toBe('*');
    await service.stop();
  });
  test('Deep Execute - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/123/persons/321/permissions/*/sync_permission', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });
    expect(
      res.status,
    ).toBe(200);
    const json = await res.json();
    expect(
      json.request.parameters.projectId,
    ).toBe('123');
    expect(
      json.request.parameters.personId,
    ).toBe('321');
    expect(
      json.request.parameters.permissionId,
    ).toBe('*');
    await service.stop();
  });
  test('Deep Query - error', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects/123/persons/321/permissions/*/sync_permission?errorCode=error',
      {
        method: 'POST',
      });
    expect(
      res.status,
    ).toBe(500);
    await service.stop();
  });
  test('Deep Execute - error 500', async () => {
    const service = new ExpressActionDeliveryService();
    const resourceActionPipelineService = new BuiltinResourceActionPipelineService();
    resourceActionPipelineService.useApi(MockApiError);
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiError),
      resourceActionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    const res = await fetch('http://localhost/projects');
    expect(
      res.status,
    ).toBe(500);
    await service.stop();
  });
  test('Start start - error', async () => {
    const service = new ExpressActionDeliveryService();
    const resourceActionPipelineService = new BuiltinResourceActionPipelineService();
    resourceActionPipelineService.useApi(MockApiError);
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiError),
      resourceActionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api);
    await expect(
      service.start(api),
    ).rejects.toThrowError();
    await service.stop();
  });
  test('Actions Repeated - error', async () => {
    const service = new ExpressActionDeliveryService();
    const resourceActionPipelineService = new BuiltinResourceActionPipelineService();
    resourceActionPipelineService.useApi(MockApiActionRepeated);
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiActionRepeated),
      resourceActionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await expect(
      service.start(api),
    ).rejects.toThrowError();
  });

  test('Execute Parameter Test - success', async () => {
    const service = new ExpressActionDeliveryService();
    const api: ApiRuntimeContext = {
      api: BuiltInApiRuntimeService.toApiProtected(MockApiRealApi),
      resourceActionPipelineService: actionPipelineService,
      resourceEventPipelineService: new MockResourceEventPipelineService(),
    };
    await service.start(api,  {port: "8080"});
    const res = await fetch('http://localhost:8080/projects/*/sync_project', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });
    const json = await res.json();
    expect(
      res.status,
    ).toBe(200);
    expect(
      json.request.parameters.projectId,
    ).toBe('*');
    await service.stop();
  });
});
