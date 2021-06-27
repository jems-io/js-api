import { ApiMiddlewareRoutine } from "./api-routine";
export interface ApiMiddleware<MiddlewareContextType = any> {
  alias: string;
  name: string;
  description?: string;
  routine: ApiMiddlewareRoutine<MiddlewareContextType>;
}
