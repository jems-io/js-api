import {
  BuiltInApiRuntimeService,
  BuiltInApiRuntimeServiceConfiguration,
} from "./services";

export function createApiRuntime(
  runtimeServiceConfiguration?: BuiltInApiRuntimeServiceConfiguration
) {
  return new BuiltInApiRuntimeService(runtimeServiceConfiguration);
}
