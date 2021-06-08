import { ApiRuntimeContext } from "@jems/api-domain/models";
import { MockApiResourceActionPipelineService } from "../services";

export const MockApiRuntimeContextWithoutResources: ApiRuntimeContext = {
  api: {
    name: "",
    version: "",
    resources: [],
  },
  apiResourceActionPipelineService: new MockApiResourceActionPipelineService(),
};
export const MockApiRuntimeContextWithoutActions: ApiRuntimeContext = {
  api: {
    name: "",
    version: "",
    resources: [
      {
        name: "",
        alias: "",
        actions: [],
        resources: [],
      },
    ],
  },
  apiResourceActionPipelineService: new MockApiResourceActionPipelineService(),
};
export const MockApiRuntimeContext: ApiRuntimeContext = {
  api: {
    name: "",
    version: "",
    resources: [
      {
        name: "Projects",
        alias: "projects",
        actions: [
          {
            id: "projects/query",
            alias: "query",
            name: "",
            type: "query",
          },
        ],
        resources: [],
      },
    ],
  },
  apiResourceActionPipelineService: new MockApiResourceActionPipelineService(),
};
