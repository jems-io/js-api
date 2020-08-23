import {ApiResponse} from '../../../domain/models';

export const MockApiResponseComplete: ApiResponse = {
  status: 'completed',
  payload: Buffer.from(''),
};
export const MockApiResponseError: ApiResponse = {
  status: 'error',
  payload: Buffer.from(''),
};
