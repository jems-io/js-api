import {ResourceActionPipelineService} from '../../domain/services';
import {ApiRequest, ApiResponse} from '../../domain/models';

export class BuiltinResourceActionPipelineService implements ResourceActionPipelineService {
  pipe(actionId: string, request: ApiRequest): Promise<ApiResponse> {

    return Promise.reject();
  }

}