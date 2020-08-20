import { ApiProtected } from "./api-protected";
import { ResourceActionPipelineService } from "../services/resource-action-pipeline-service";
import { ResourceEventPipelineService } from "../services/resource-event-pipeline-service";

export interface ApiRuntimeContext {
    api: ApiProtected
    resourceActionPipelineService: ResourceActionPipelineService
    resourceEventPipelineService: ResourceEventPipelineService
}