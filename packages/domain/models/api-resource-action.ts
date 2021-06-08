import { ApiMiddleware } from "./api-middleware";
import { ApiResourceActionType } from "./api-resource-action-type";
import { ApiRoutine } from "./api-routine";

export interface ApiResourceAction {
  alias: string;
  name: string;
  type: ApiResourceActionType;
  description?: string;
  middlewares?: ApiMiddleware[];
  routine: ApiRoutine;
}
