import { ApiResource } from "./api-resource";
import { ApiMiddleware } from "./api-middleware";
import { ApiContext } from "./api-context";

export interface Api<ApiContextType extends ApiContext = ApiContext> {
  name: string;
  version: string;
  description?: string;
  resources: ApiResource<ApiContextType>[];
  middlewares?: ApiMiddleware<ApiContextType>[];
}