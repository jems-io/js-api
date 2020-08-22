import { Api } from "./api";
import { ApiResource } from "./api-resource";
import { ApiResourceAction } from "./api-resource-action";
import { ApiResourceEvent } from "./api-resource-event";

interface ApiResourceProtected extends Readonly<Omit<ApiResource, 'actions' | 'events' | 'resources' | 'actionsMiddlewares'>> {
    readonly actions: Array<Readonly<Omit<ApiResourceAction, 'routine' | 'middlewares'> & { id: string }>>
    readonly events: Array<Readonly<ApiResourceEvent & { id: string }>>
    readonly resources: ApiResourceProtected[], 
}

export interface ApiProtected extends Readonly<Omit<Api, 'resources' | 'resourcesActionsMiddlewares'>> {
    readonly resources: ApiResourceProtected[] 
}
