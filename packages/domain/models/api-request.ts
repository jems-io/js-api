import {ApiRuntimeContext} from './api-runtime-context';

export interface ApiRequest {
    id: string
    resourceId?: string
    metadata: { [ name:string ]: any }
    parameters: { [ name:string ]: string }
    payload: Buffer,
    context?: ApiRuntimeContext
}