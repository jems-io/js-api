import { ApiContext } from "./api-context";

export interface ApiRequest<RequestContextType extends ApiContext = ApiContext> {
  id: string;
  actionId: string;
  resourceId?: string;
  metadata: { [name: string]: string | string[] };
  parameters: { [name: string]: string };
  payload: Buffer;
  context: RequestContextType;
}