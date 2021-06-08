import {ApiResponse} from '@jems/api-domain/models';

export const MockApiResponseComplete: ApiResponse = {
  status: 'completed',
  payload: Buffer.from(''),
  payloadType: 'json'
};
export const MockApiResponseError: ApiResponse = {
  status: 'error',
  payload: Buffer.from(''),
  payloadType: 'json'
};
