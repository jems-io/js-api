export interface ApiRequest {
    id: string
    resourceId: string
    metadata: { [ name:string ]: string }
    parameters: { [ name:string ]: string }
    payload: Buffer
}