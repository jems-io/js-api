import {ApiResponseStatus} from './api-respos-status';

export type PayloadType = 'json' | 'text' | 'xml' | 'binary'

export interface ApiResponse {
  status: ApiResponseStatus
  payload: Buffer
  payloadType: PayloadType
}