import {
  BuiltInApiResponseBuildService,
  BuiltInApiRuntimeService,
  BuiltInApiRuntimeServiceConfiguration,
} from "./services";

export function createApiRuntime(
  runtimeServiceConfiguration?: BuiltInApiRuntimeServiceConfiguration
) {
  return new BuiltInApiRuntimeService(runtimeServiceConfiguration);
}

export function createApiResponseBuildService() {
  return new BuiltInApiResponseBuildService();
}
