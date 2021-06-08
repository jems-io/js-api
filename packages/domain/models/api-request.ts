import { ApiProtected } from "./api-protected";

export interface ApiRequest<ContextType = { [key: string]: any }> {
  id: string;
  actionId: string;
  resourceId?: string;
  metadata: { [name: string]: string | string[] };
  parameters: { [name: string]: string };
  payload: Buffer;
  context?: ContextType;
}
