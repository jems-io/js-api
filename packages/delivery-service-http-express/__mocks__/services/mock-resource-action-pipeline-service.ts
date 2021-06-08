import { ApiRequest, ApiResponse } from "@jems/api-domain/models";
import { ApiResourceActionPipelineService } from "@jems/api-domain/services";
import { MockApiResponseComplete, MockApiResponseError } from "../models";

export class MockApiResourceActionPipelineService
  implements ApiResourceActionPipelineService
{
  pipe(actionId: string, request: ApiRequest): Promise<ApiResponse> {
    if (actionId === "0") {
      return Promise.resolve(MockApiResponseComplete);
    }
    return Promise.resolve(MockApiResponseError);
  }
}
