import { ApiMiddleware } from "./api-middleware";
import { ApiResourceActionType } from "./api-resource-action-type";
import { ApiRoutine } from "./api-routine";

export interface ApiResourceAction<ActionContextType = any> {
  type: ApiResourceActionType;
  name: string;
  alias?: string;
  description?: string;
  middlewares?: ApiMiddleware[];
  routine: ApiRoutine<ActionContextType>;
}
