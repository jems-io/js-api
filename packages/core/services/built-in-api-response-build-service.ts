import {ApiResponseBuildService, ApiResponse, ApiResponseStatus} from '@jems/api-domain';

export class BuiltInApiResponseBuildService implements ApiResponseBuildService {
  buildBinaryResponse(binary: Buffer, apiResponseStatus: ApiResponseStatus): ApiResponse {
    return {
      status: apiResponseStatus,
      payload: binary,
      payloadType: 'binary',
    };
  }

  buildJsonResponse(json: any, apiResponseStatus: ApiResponseStatus): ApiResponse {
    return {
      status: apiResponseStatus,
      payload: Buffer.from(json),
      payloadType: 'json',
    };
  }

  buildTextResponse(text: string, apiResponseStatus: ApiResponseStatus): ApiResponse {
    return {
      status: apiResponseStatus,
      payload: Buffer.from(text),
      payloadType: 'text',
    };
  }

  buildXmlResponse(xml: XMLDocument, apiResponseStatus: ApiResponseStatus): ApiResponse {
    return {
      status: apiResponseStatus,
      payload: Buffer.from(xml),
      payloadType: 'xml',
    };
  }
}
