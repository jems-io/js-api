import { ApiMiddleware } from "./api-middleware";
import { ApiResourceAction } from "./api-resource-action";

export interface ApiResource<ResourceContextType = any> {
  alias: string;
  name: string;
  description?: string;
  actions?: ApiResourceAction<ResourceContextType>[];
  middlewares?: ApiMiddleware<ResourceContextType>[];
  resources?: ApiResource[];
}
