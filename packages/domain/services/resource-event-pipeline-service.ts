
import { ApiEvent } from "../models/api-event";

export interface ResourceEventPipelineService {
    pipe(eventId: string, eventContent: ApiEvent): Promise<void>
    subscribeListener(eventId: string, handler: (event: ApiEvent) => Promise<void>): Promise<void>
    unsubscribeListener(eventId: string, handler: (event: ApiEvent) => Promise<void>): Promise<void>
}