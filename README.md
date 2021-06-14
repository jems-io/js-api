<p align="center">
    <a href="https://opensource.softlutionx.com" target="_blank"><img width="200"src="https://raw.githubusercontent.com/JemsFramework/api/master/media/jems.png">       
    </a>    
    </br> 
    <b>API Framework</b>
</p>

A framework that allow build APIs that are agnostic of their exposition, allowing builders to focus on their buisness logic, functionality and behaviot while forgeting about the technologies to expose those which always are changing. Wrote using SOLID principles and a variety OOP patterns implementations, typescript definitions included.

## **Why ?**

> This is opinionated, as every framework in the world.

Now days (2019), when developers refer to APIs what immediately comes to their minds are Web API which are a way expose an actual API. This misconception makes them immediately think about http protocol, controllers, routes before thinking what the API actually need to do.

The `Application Program Interface` (`API`) its an interface (as contained in its name) that provide other applications/programs access to the functionalities and behavior in an application/program, this is commonly done throught packages or libraries dependencies (in-process consumtion) or with an `Inter Process Communication` (`IPC`) mechanism as http, pipes, sockets, memory sharing, TCP/IP and others (out-process consumtion). 

ie.

Imagine the following scenario.

- `Program A`: a library (a library still is a program) that can resize images.
- `Program B`: an application which use the the image resizing library, in which we can pass a file system image path in and the application resize the image producing another image that is writen into the file system in the same path but adding the word `resized` to the file name.
- `Program C`: a mobile chat application which use the the image resizing library to reduce an image size before sending it in a chat.
- `Program D`: a web application which use the the image resizing library to reduce an image size before sending it in a chat.

As we descibe earlier in ths section APIs expose functionality and behavior, in this case the `Program A` image resizing capability, is the functionality that the other programs needs to perform their work, so let's start from back to front.

- `Program D`: needs to use the library, but this library is not written in javascript and cannot be used in the browser. In this case we commonly will create another program, `Program E`, which will expose the library funtionality acting as an API which in this case is web (Web API), so `Program E` is a program acting as an API that allow `Program D` access the functionality and behavior in `Program A`.
- `Program C` and `Program B`: needs to use the library, but those programs/application can import the library, which means no need for an extra application, and you maybe will be wondering, what will represents the API there if the programs imports the code directly. The answer will depend on how the language work, in an interpretate language as javascript, the API will be the js runtime which will allow code to interact, in a compiled language as C# it will be the Common Language Runtime (CLR) which will provide interoperabilty beween libraries.

Now that the concept of API is explained, API Framework allow you to write functionality and behavior without caring about how those will be delivered to the consumers. ie. direct language specific library/package import, RESTful , MVC, GQL, gRPC, TCP/IP, UDP or any other.

## **How it works ?**

> Examples are in typescript, if you are using plain javascript omit the types.

1. First thing, we need to add the packages need.

    ```
    yarn add @jems/api-domain @jems/api-core @jems/api-delivery-http-express
    ```

    ### @jems/api-domain

    Followind Domain Driven Design (DDD), in this package we will find all the abstraction and constracts related to the domain that are and can be used in API Framework.

    ### @jems/api-core

    Here we have a basic built in implementation of the api domain.

    ### @jems/api-delivery-http-express

    This package allow the exposition of the API as RESTful through http using express which is a popular js library for that purpose.

    > More delivery service will come. GQL, gRPC and more...

2. Declare and execute your API with a delivery service.

    We use a decarative aproach in which API bulders have to completly declare their APIs arround resources and actions.

    We will explain this code in detail.

    ``` js
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
    ```

    TODO ...