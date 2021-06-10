import { ApiLogService, ApiResourceActionPipelineService } from "../services";
import { ApiProtected } from "./api-protected";

export interface ApiRuntimeContext {
  api: ApiProtected;
  apiResourceActionPipelineService: ApiResourceActionPipelineService;
  apiLogService: ApiLogService;
}
