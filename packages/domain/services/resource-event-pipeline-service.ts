
import { ApiResponse } from "../models/api-respose";
import { ApiEvent } from "../models/api-event";

export interface ResourceEventPipelineService {
    pipe(eventId: string, eventContent: ApiEvent): Promise<void>
}