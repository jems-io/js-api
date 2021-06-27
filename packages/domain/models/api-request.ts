export interface ApiRequest<ReqestContextType = any> {
  id: string;
  actionId: string;
  resourceId?: string;
  metadata: { [name: string]: string | string[] };
  parameters: { [name: string]: string };
  payload: Buffer;
  context?: Partial<ReqestContextType>;
}
