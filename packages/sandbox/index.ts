/**
 * Import the needed dependencies.
 */
import {
  createApiResponseBuildService,
  createApiRuntime,
  createConsoleApiLogService,
  LogLevel,
} from "@jems/api-core";
import { HttpExpressDeliveryService } from "@jems/api-delivery-http-express";
import { Api, ApiRequest } from "@jems/api-domain";

/**
 * Mock some data to use it in the API.
 */
interface UserStatus {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  statusId: number;
}

const userStatuses: UserStatus[] = [
  { id: 0, name: "active" },
  { id: 0, name: "master" },
  { id: 0, name: "deactive" },
];

const users: User[] = [
  { id: 1, name: "User abcd 1", statusId: 0 },
  { id: 2, name: "User cdef 2", statusId: 0 },
  { id: 3, name: "User edgh 3", statusId: 1 },
  { id: 4, name: "User ghij 4", statusId: 0 },
];

interface SanboxApiContext {
  log(message: any): void;
}

/**
 * Create an api response build service which will simplify the way to create
 * responses in the API reosuces actions.
 */
const apiResponseBuildService = createApiResponseBuildService();

/**
  *Start declaring the API by giving it a name and a version. Using the `Api` type
  we import from the domain will help to easily declare the API with an IDE IntelliSense.
  */
const exampleApi: Api<SanboxApiContext> = {
  name: "Example API",
  version: "0.0.1",
  middlewares: [
    {
      alias: 'context-setup',
      name: "Context Setup",
      routine: async (req, next) => {
        req.context.log = (message) => console.log(message)
        return next(req)
      }
    }
  ],
  resources: [
    /**
     * Add a resource to the declared API. Give it an alias and a name.
     */
    {
      alias: "users",
      name: "Users",
      actions: [
        /**
         * Add actions to the resource. The actions must contain a type, name and routine
         * which is the code that will run when the action is executed.
         *
         * Optional you can add an alias to the actio, deliveri services will use the alias differently.
         *
         * Types: get | create | update | delete | patch | query | execute
         *
         * No actions with the same type and alias can exists in a single resource.
         */
        {
          type: "query",
          name: "Query Users",
          routine: (req: ApiRequest<SanboxApiContext>) => {
            req.context.log("...")

            const filteredUser = req.parameters.name
              ? users.filter((u) => u.name.includes(req.parameters.name))
              : users;
            return apiResponseBuildService.buildJsonResponse(filteredUser);
          },
        },
        {
          type: "query",
          alias: "master",
          name: "Query Master User",
          routine: (req) => {
            const foundUser = users.find(
              (u) => u.statusId === 1 // 1 = Master
            );

            return foundUser
              ? apiResponseBuildService.buildJsonResponse(foundUser)
              : apiResponseBuildService.buildJsonResponse(
                  { message: "User Not Found" },
                  "resourceNotFound"
                );
          },
        },
        {
          type: "get",
          name: "Get User",
          routine: (req) => {
            const foundUser = users.find(
              (u) => u.id === parseInt(req.parameters.userId)
            );

            return foundUser
              ? apiResponseBuildService.buildJsonResponse(foundUser)
              : apiResponseBuildService.buildJsonResponse(
                  { message: "User Not Found" },
                  "resourceNotFound"
                );
          },
        },
        {
          type: "create",
          name: "Create Users",
          routine: (req) => {
            console.log(req.payload)
            console.log(JSON.parse(req.payload.toString()))
            return apiResponseBuildService.buildJsonResponse({ status: "ok" });
          },
        },
        {
          type: "update",
          name: "Update Users",
          routine: (req) => {
            // TODO: Update the user
            return apiResponseBuildService.buildJsonResponse({ status: "ok" });
          },
        },
        {
          type: "execute",
          alias: "deactivate",
          name: "Deactivate Users",
          routine: (req) => {
            // TODO: Update the user
            return apiResponseBuildService.buildJsonResponse({ status: "ok" });
          },
        },
      ],
    },
    {
      alias: "statuses",
      name: "User Statuses",
      actions: [
        {
          type: "query",
          name: "Query User Statuses",
          routine: (req) =>
            apiResponseBuildService.buildJsonResponse(userStatuses),
        },
      ],
    },
  ],
};

/**
 * Creati an api runtime service to execute your delcared api.
 */
const builtInApiRuntimeService = createApiRuntime({
  logService: createConsoleApiLogService({ level: LogLevel.debug }),
});

async function start() {
  /**
   * Register a delivery service to deliver the api in a desire technology/protocol, in this case we are using http.
   */
  await builtInApiRuntimeService.registerDeliveryService(
    new HttpExpressDeliveryService(),
    {
      port: "8080",
    }
  );

  /**
   * Execute your declared api.
   */
  await builtInApiRuntimeService.execute(exampleApi);
}

start();