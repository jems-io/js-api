import { ApiMiddlewareRoutine } from "./api-routine";
export interface ApiMiddleware {
  alias: string;
  name: string;
  description?: string;
  routine: ApiMiddlewareRoutine;
}
