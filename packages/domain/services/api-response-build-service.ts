import {ApiResponse, ApiResponseStatus} from '../models';

export interface ApiResponseBuildService {
  buildJsonResponse(json: any, apiResponseStatus: ApiResponseStatus): ApiResponse

  buildTextResponse(text: string, apiResponseStatus: ApiResponseStatus): ApiResponse

  buildXmlResponse(xml: XMLDocument, apiResponseStatus: ApiResponseStatus): ApiResponse

  buildBinaryResponse(binary: Buffer, apiResponseStatus: ApiResponseStatus): ApiResponse
}