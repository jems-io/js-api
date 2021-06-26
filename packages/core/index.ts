import { ApiLogService, ApiRuntimeService } from "@jems/api-domain";
import {
  BuiltInApiResponseBuildService,
  BuiltInApiRuntimeService,
  BuiltInApiRuntimeServiceConfiguration,
  ConsoleApiLogService,
  ConsoleApiLogServiceConfiguration,
} from "./services";

export * from "./models";

export function createApiRuntime(
  configuration?: BuiltInApiRuntimeServiceConfiguration
): ApiRuntimeService {
  return new BuiltInApiRuntimeService(configuration);
}

export function createApiResponseBuildService(): BuiltInApiResponseBuildService {
  return new BuiltInApiResponseBuildService();
}

export function createConsoleApiLogService(
  configuration?: ConsoleApiLogServiceConfiguration
): ApiLogService {
  return new ConsoleApiLogService(configuration);
}
