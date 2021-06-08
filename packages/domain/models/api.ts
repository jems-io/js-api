import { ApiResource } from "./api-resource";
import { ApiMiddleware } from "./api-middleware";

export interface Api {
  name: string;
  version: string;
  description?: string;
  resources: ApiResource[];
  middlewares?: ApiMiddleware[];
}
