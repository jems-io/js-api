import { ApiMiddleware } from "./api-middleware";
import { ApiResourceAction } from "./api-resource-action";

export interface ApiResource<ResourceContextType extends { [key: string]: any } = { [key: string]: any }> {
  alias: string;
  name: string;
  description?: string;
  actions?: ApiResourceAction<ResourceContextType>[];
  middlewares?: ApiMiddleware<ResourceContextType>[];
  resources?: ApiResource[];
}
