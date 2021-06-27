import { ApiResource } from "./api-resource";
import { ApiMiddleware } from "./api-middleware";

export interface Api<ApiContextType = { [key: string]: any }> {
  name: string;
  version: string;
  description?: string;
  resources: ApiResource<ApiContextType>[];
  middlewares?: ApiMiddleware<ApiContextType>[];
}
