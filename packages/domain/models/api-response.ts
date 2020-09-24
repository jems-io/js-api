import {ApiResponseStatus} from './api-respos-status';

export interface ApiResponse {
  status: ApiResponseStatus
  payload: Buffer,
  payloadType: PayloadType
}

export type PayloadType = 'json' | 'text' | 'xml' | 'binary'