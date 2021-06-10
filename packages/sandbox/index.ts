import {
  createApiResponseBuildService,
  createApiRuntime,
} from "@jems/api-core";
import { ExpressActionDeliveryService } from "@jems/api-delivery-http-express";
import { Api } from "@jems/api-domain";

const apiResponseBuildService = createApiResponseBuildService();
const api: Api = {
  name: "Sanbox Api",
  version: "1.0",
  resources: [
    {
      alias: "users",
      name: "Users",
      actions: [
        {
          type: "query",
          name: "Query Users",
          routine: (req) => apiResponseBuildService.buildJsonResponse(req),
        },
        {
          type: "get",
          name: "Get User",
          routine: (req) =>
            apiResponseBuildService.buildJsonResponse(
              { message: "Resource Not Found" },
              "resourceNotFound"
            ),
        },
        {
          type: "get",
          alias: "default2",
          name: "Get Users",
          routine: (req) =>
            apiResponseBuildService.buildJsonResponse(
              { message: "Resource Not Found 2" },
              "resourceNotFound"
            ),
        },
      ],
    },
    {
      alias: "friends",
      name: "Friends",
      actions: [
        {
          type: "query",
          name: "Query Friends",
          routine: (req) => apiResponseBuildService.buildJsonResponse(req),
        },
        {
          type: "get",
          name: "Get Friend",
          routine: (req) => {
            return apiResponseBuildService.buildJsonResponse(
              { message: "Resource Not Found" },
              "resourceNotFound"
            );
          },
        },
        {
          type: "get",
          alias: "default2",
          name: "Get Friends",
          routine: (req) =>
            apiResponseBuildService.buildJsonResponse(
              { message: "Resource Not Found 2" },
              "resourceNotFound"
            ),
        },
      ],
    },
  ],
};

const builtInApiRuntimeService = createApiRuntime();

(async function start() {
  await builtInApiRuntimeService.registerDeliveryService(
    new ExpressActionDeliveryService(),
    {
      port: "8080",
    }
  );
  await builtInApiRuntimeService.execute(api);
})();
