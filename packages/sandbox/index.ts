  import {
    createApiResponseBuildService,
    createApiRuntime,
  } from "@jems/api-core";
  import { HttpExpressDeliveryService } from "@jems/api-delivery-http-express";
  import { Api } from "@jems/api-domain";

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

  const apiResponseBuildService = createApiResponseBuildService();
  const exampleApi: Api = {
    name: "Example API",
    version: "0.0.1",
    resources: [
      {
        alias: "users",
        name: "Users",
        actions: [
          {
            type: "query",
            name: "Query Users",
            routine: (req) => {
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
                (u) => u.statusId === 1 // 1=Master
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

  const builtInApiRuntimeService = createApiRuntime();

  (async function start() {
    await builtInApiRuntimeService.registerDeliveryService(
      new HttpExpressDeliveryService(),
      {
        port: "8080",
      }
    );
    await builtInApiRuntimeService.execute(exampleApi);
  })();
