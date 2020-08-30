import {
  Api, ApiRequest,
  ApiResponse, ApiRoutine,
} from '../../../domain/models';

export const MockApi: Api = {
  name: 'Mock Api',
  version: '0.0.1',
  description: undefined,
  resources: [
    {
      alias: 'projects',
      name: 'Projects',
      actions: [],
      actionsMiddlewares: [],
      events: [
        {
          alias: 'event1',
          name: 'Event 1',
        },
      ],
      resources: [
        {
          alias: 'vaults',
          name: 'Vaults',
          actions: [
            {
              alias: 'query',
              name: 'Query Vaults',
              type: 'query',
              middlewares: [],
              routine: (request): ApiResponse => {
                return {
                  status: 'completed',
                  payload: Buffer.from(''),
                };
              },
            },
            {
              alias: 'get',
              name: 'Get Vault By Id',
              type: 'get',
              middlewares: [],
              routine: (request): ApiResponse => {
                return {
                  status: 'completed',
                  payload: Buffer.from(''),
                };
              },
            },
          ],
          actionsMiddlewares: [],
          events: [
            {
              alias: 'Event deep',
              name: 'Event deep',
            },
          ],
          resources: [
            {
              alias: 'items',
              name: 'Items',
              actions: [],
              actionsMiddlewares: [],
              events: [],
            },
          ],
        },
      ],
    },
  ],
  resourcesActionsMiddlewares: [],
};

export type OnRunAction = (actionAlias: string) => void
export const getApiMockRunOneAction = (onRunAction: OnRunAction): Api => {
  return {
    name: 'Mock Api',
    version: '0.0.1',
    description: undefined,
    resources: [
      {
        alias: 'projects',
        name: 'Projects',
        actions: [],
        actionsMiddlewares: [],
        events: [],
        resources: [
          {
            alias: 'vaults',
            name: 'Vaults',
            actions: [
              {
                alias: 'query',
                name: 'Query Vaults',
                type: 'query',
                middlewares: [],
                routine: (request): ApiResponse => {
                  onRunAction('query');
                  return {
                    status: 'completed',
                    payload: Buffer.from(''),
                  };
                },
              },
            ],
            actionsMiddlewares: [],
            events: [],
            resources: [
              {
                alias: 'items',
                name: 'Items',
                actions: [],
                actionsMiddlewares: [],
                events: [],
              },
            ],
          },
        ],
      },
    ],
    resourcesActionsMiddlewares: [],
  };
};

export const MockApiCrashOnFirstMiddleware: Api = {
  name: 'Mock Api',
  version: '0.0.1',
  description: undefined,
  resources: [
    {
      alias: 'projects',
      name: 'Projects',
      actions: [
        {
          alias: 'query',
          name: 'Query Vaults',
          type: 'query',
          middlewares: [],
          routine: (request): ApiResponse => {
            return {
              status: 'completed',
              payload: Buffer.from(''),
            };
          },
        },
      ],
      actionsMiddlewares: [],
      events: [],
      resources: [],
    },
  ],
  resourcesActionsMiddlewares: [
    {
      alias: 'middle-crash',
      name: 'Crash on Middleware',
      routine: (ApiRequest) => {
        throw Error('Crash on Middleware');
      },
    },
  ],
};

export const MockApiCrashOnDeepMiddleware: Api = {
  name: 'Mock Api',
  version: '0.0.1',
  description: undefined,
  resources: [
    {
      alias: 'projects',
      name: 'Projects',
      actions: [
        {
          alias: 'query',
          name: 'Query Vaults',
          type: 'query',
          middlewares: [
            {
              alias: 'middle-deep-crash',
              name: 'Crash on Deep Middleware',
              routine: (apiRequest) => {
                throw Error('Crash on Middleware deep');
              },
            },
          ],
          routine: (request): ApiResponse => {
            return {
              status: 'completed',
              payload: Buffer.from(''),
            };
          },
        },
      ],
      actionsMiddlewares: [],
      events: [],
      resources: [],
    },
  ],
  resourcesActionsMiddlewares: [
    {
      alias: 'middle',
      name: 'Middleware',
      routine: (apiRequest): ApiRequest => {
        return apiRequest;
      },
    },
  ],
};
export const getApiMockRunOneActionWithMultipleResources = (onRunAction: OnRunAction): Api => {
  return {
    name: 'Mock Api',
    version: '0.0.1',
    description: undefined,
    resources: [
      {
        alias: 'projects2',
        name: 'Projects2',
        actions: [],
        actionsMiddlewares: [],
        events: [],
        resources: [
          {
            alias: 'vaults2',
            name: 'Vaults2',
            actions: [
              {
                alias: 'query2',
                name: 'Query Vaults',
                type: 'query',
                middlewares: [],
                routine: (request): ApiResponse => {
                  onRunAction('query2');
                  return {
                    status: 'completed',
                    payload: Buffer.from(''),
                  };
                },
              },
              {
                alias: 'get_by_id',
                name: 'Get Vault By Id',
                type: 'get',
                middlewares: [],
                routine: (request): ApiResponse => {
                  onRunAction('get_by_id');
                  return {
                    status: 'completed',
                    payload: Buffer.from(''),
                  };
                },
              },
            ],
            actionsMiddlewares: [],
            events: [],
            resources: [
              {
                alias: 'items',
                name: 'Items',
                actions: [],
                actionsMiddlewares: [],
                events: [],
              },
            ],
          },
        ],
      },
      {
        alias: 'projects',
        name: 'Projects',
        actions: [],
        actionsMiddlewares: [],
        events: [],
        resources: [
          {
            alias: 'vaults',
            name: 'Vaults',
            actions: [
              {
                alias: 'query',
                name: 'Query Vaults',
                type: 'query',
                middlewares: [],
                routine: (request): ApiResponse => {
                  onRunAction('projects/vaults/query');
                  return {
                    status: 'completed',
                    payload: Buffer.from(''),
                  };
                },
              },
            ],
            actionsMiddlewares: [],
            events: [],
            resources: [
              {
                alias: 'items',
                name: 'Items',
                actions: [],
                actionsMiddlewares: [],
                events: [],
              },
            ],
          },
          {
            alias: 'encryption',
            name: 'encryption',
            actions: [
              {
                alias: 'delete',
                name: 'Query encryption',
                type: 'delete',
                middlewares: [],
                routine: (request): ApiResponse => {
                  onRunAction('delete');
                  return {
                    status: 'completed',
                    payload: Buffer.from(''),
                  };
                },
              },
            ],
            actionsMiddlewares: [],
            events: [],
          },
        ],
      },
    ],
    resourcesActionsMiddlewares: [],
  };
};