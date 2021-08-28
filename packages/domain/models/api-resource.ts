import { ApiContext } from "./api-context";
import { ApiMiddleware } from "./api-middleware";
import { ApiResourceAction } from "./api-resource-action";

export interface ApiResource<ResourceContextType extends ApiContext = ApiContext> {
  alias: string;
  name: string;
  description?: string;
  actions?: ApiResourceAction<ResourceContextType>[];
  middlewares?: ApiMiddleware<ResourceContextType>[];
  resources?: ApiResource[];
}
