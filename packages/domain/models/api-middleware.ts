import { ApiContext } from "./api-context";
import { ApiMiddlewareRoutine } from "./api-routine";
export interface ApiMiddleware<MiddlewareContextType extends ApiContext = ApiContext> {
  alias: string;
  name: string;
  description?: string;
  routine: ApiMiddlewareRoutine<MiddlewareContextType>;
}
