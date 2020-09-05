export interface ApiRequest {
    id: string
    resourceId: string
    metadata: { [ name:string ]: any }
    parameters: { [ name:string ]: string }
    payload: Buffer
}