import {
  ApiResourceActionMiddleware,
  ApiResourceActionProtected,
  ApiResourceActionType,
  ApiResourceEventProtected, ApiResponse, ApiRoutine,
  ApiRuntimeContext,
} from '../../../domain/models';
import {MockResourceActionPipelineService, MockResourceEventPipelineService} from '../services';

export const MockApiRuntimeContextWithoutResources: ApiRuntimeContext = {
  api: {
    name: '',
    version: '',
    resources: [],
  },
  resourceActionPipelineService: new MockResourceActionPipelineService(),
  resourceEventPipelineService: new MockResourceEventPipelineService(),
};
export const MockApiRuntimeContextWithoutActions: ApiRuntimeContext = {
  api: {
    name: '',
    version: '',
    resources: [
      {
        name: '',
        alias: '',
        actions: [],
        events: [],
        resources: [],
      },
    ],
  },
  resourceActionPipelineService: new MockResourceActionPipelineService(),
  resourceEventPipelineService: new MockResourceEventPipelineService(),
};
export const MockApiRuntimeContext: ApiRuntimeContext = {
  api: {
    name: '',
    version: '',
    resources: [
      {
        name: 'Projects',
        alias: 'projects',
        actions: [
          {
            id: 'projects/query',
            alias: 'query',
            name: '',
            type: 'query',
          },
        ],
        events: [],
        resources: [],
      },
    ],
  },
  resourceActionPipelineService: new MockResourceActionPipelineService(),
  resourceEventPipelineService: new MockResourceEventPipelineService(),
};
