import { ApiPayloadType } from "./api-payload-type";
import { ApiResponseStatus } from "./api-response-status";

export interface ApiResponse {
  status: ApiResponseStatus;
  payload: Buffer;
  payloadType: ApiPayloadType;
}
