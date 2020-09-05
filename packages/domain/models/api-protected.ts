import {Api} from './api';
import {ApiResource} from './api-resource';
import {ApiResourceAction} from './api-resource-action';
import {ApiResourceEvent} from './api-resource-event';

export interface ApiResourceProtected extends Readonly<Omit<ApiResource, 'actions' | 'events' | 'resources' | 'actionsMiddlewares'>> {
  readonly actions: Array<ApiResourceActionProtected>
  readonly events: Array<ApiResourceEventProtected>
  readonly resources: ApiResourceProtected[],
}

export interface ApiProtected extends Readonly<Omit<Api, 'resources' | 'resourcesActionsMiddlewares'>> {
  readonly resources: ApiResourceProtected[]
}

export interface ApiResourceActionProtected extends Readonly<Omit<ApiResourceAction, 'routine' | 'middlewares'>> {
  readonly id: string
}

export interface ApiResourceEventProtected extends Readonly<ApiResourceEvent> {
  readonly id: string
}
