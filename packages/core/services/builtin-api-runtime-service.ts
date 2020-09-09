import {
  ApiRuntimeService,
  Api,
  ResourceActionDeliveryService,
  ResourceEventDeliveryService,
  ApiRuntimeContext,
  ApiProtected,
  ResourceActionPipelineService,
  ResourceEventPipelineService,
  ApiResource,
  ApiResourceProtected, ApiResourceAction, ApiResourceEvent,
} from '@jems/api-domain';
import * as uuid from 'uuid';

interface ActionDeliveryServiceRegister {
  [registerDeliveryServiceId: string]:
    {
      actionDeliveryService: ResourceActionDeliveryService,
      parameters: { [paramName: string]: string }
    }
}

export class BuiltInApiRuntimeService implements ApiRuntimeService {
  private api?: Api;
  private actionDeliveryService: ActionDeliveryServiceRegister = {};
  private eventDeliveryService: { [registerDeliveryServiceId: string]: ResourceEventDeliveryService } = {};

  constructor(private resourceActionPipelineService: ResourceActionPipelineService,
              private resourceEventPipelineService: ResourceEventPipelineService) {
  }

  async useApi(api: Api): Promise<void> {
    this.api = api;
    return Promise.resolve();
  }

  registerResourceActionDeliveryMechanism(api: ResourceActionDeliveryService, parameters: { [paramName: string]: string } = {}): Promise<string> {
    const registryId = uuid.v4();
    this.actionDeliveryService[registryId] = {
      actionDeliveryService: api,
      parameters,
    };
    return Promise.resolve(registryId);
  }

  async unregisterResourceActionDeliveryMechanism(registryId: string): Promise<void> {
    await this.actionDeliveryService[registryId]?.actionDeliveryService.stop();
    delete this.actionDeliveryService[registryId];
  }

  registerResourceEventDeliveryMechanism(api: ResourceEventDeliveryService): Promise<string> {
    const registryId = uuid.v4();
    this.eventDeliveryService[registryId] = api;
    return Promise.resolve(registryId);
  }

  async unregisterResourceEventDeliveryMechanism(registryId: string): Promise<void> {
    await this.eventDeliveryService[registryId]?.stop();
    delete this.eventDeliveryService[registryId];
  }

  async execute(): Promise<void> {
    const api = this.api;
    if (api === undefined) {
      throw Error('Api must be define');
    }
    const apiRuntimeContext = this.toApiRuntimeContext(api);
    await Promise.all(
      [
        ...Object.keys(this.actionDeliveryService).map(key => {
          this.actionDeliveryService[key].actionDeliveryService.start(apiRuntimeContext, this.actionDeliveryService[key].parameters);
        }),
        ...Object.keys(this.eventDeliveryService).map(key => {
          this.eventDeliveryService[key].start(apiRuntimeContext);
        }),
      ],
    );
  }

  private toApiRuntimeContext(api: Api): ApiRuntimeContext {
    return {
      api: BuiltInApiRuntimeService.toApiProtected(api),
      resourceActionPipelineService: this.resourceActionPipelineService,
      resourceEventPipelineService: this.resourceEventPipelineService,
    };
  }

  static toApiProtected(api: Api): ApiProtected {
    const {resourcesActionsMiddlewares, ...apiProtectedValues} = api;
    return {
      ...apiProtectedValues,
      resources: api.resources.map((resource: ApiResource) => BuiltInApiRuntimeService.toApiResourceProtected(resource)),
    };
  }

  static toApiResourceProtected(apiResource: ApiResource, path: string = ''): ApiResourceProtected {
    if (path !== '') {
      path += '/';
    }
    const currentPath = `${path}${apiResource.alias}`;
    return {
      name: apiResource.name,
      alias: apiResource.alias,
      actions: apiResource.actions.map((action: ApiResourceAction) => ({
        ...action,
        id: `${currentPath}/${action.alias}`,
      })),
      events: apiResource.events.map((event: ApiResourceEvent) => ({
        ...event,
        id: `${currentPath}/${event.alias}`,
      })),
      resources: apiResource.resources?.map((resource: ApiResource) => BuiltInApiRuntimeService.toApiResourceProtected(resource, currentPath)) || [],
    };
  }
}