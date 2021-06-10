import { ApiMiddleware } from "./api-middleware";
import { ApiResourceAction } from "./api-resource-action";

export interface ApiResource {
  alias: string;
  name: string;
  description?: string;
  actions?: ApiResourceAction[];
  middlewares?: ApiMiddleware[];
  resources?: ApiResource[];
}
