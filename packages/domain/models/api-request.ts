export interface ApiRequest<RequestContextType extends { [key: string]: any } = { [key: string]: any }> {
  id: string;
  actionId: string;
  resourceId?: string;
  metadata: { [name: string]: string | string[] };
  parameters: { [name: string]: string };
  payload: Buffer;
  context: RequestContextType;
}