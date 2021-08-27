import { ApiMiddlewareRoutine } from "./api-routine";
export interface ApiMiddleware<MiddlewareContextType extends { [key: string]: any } = { [key: string]: any }> {
  alias: string;
  name: string;
  description?: string;
  routine: ApiMiddlewareRoutine<MiddlewareContextType>;
}
