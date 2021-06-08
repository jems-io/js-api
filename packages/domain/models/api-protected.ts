import { Api } from "./api";
import { ApiResource } from "./api-resource";
import { ApiResourceAction } from "./api-resource-action";

export interface ApiResourceActionProtected
  extends Readonly<Omit<ApiResourceAction, "routine" | "middlewares">> {
  readonly id: string;
}

export interface ApiResourceProtected
  extends Readonly<Omit<ApiResource, "actions" | "resources" | "middlewares">> {
  readonly actions: Array<ApiResourceActionProtected>;
  readonly resources: ApiResourceProtected[];
}

export interface ApiProtected
  extends Readonly<Omit<Api, "resources" | "middlewares">> {
  readonly resources: ApiResourceProtected[];
}
