import {ResourceActionPipelineService} from '../../../domain/services';
import {ApiRequest, ApiResponse} from '../../../domain/models';
import {MockApiResponseComplete, MockApiResponseError} from '../models';

export class MockResourceActionPipelineService implements ResourceActionPipelineService {
  pipe(actionId: string, request: ApiRequest): Promise<ApiResponse> {
    if (actionId === '0') {
      return Promise.resolve(MockApiResponseComplete);
    }
    return Promise.resolve(MockApiResponseError);
  }
}