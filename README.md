<p align="center">
    <a href="https://opensource.beagil.com/jems" target="_blank"><img width="200"src="https://raw.githubusercontent.com/jems-io/api/master/media/jems.png">       
    </a>    
    </br> 
    <b>API Framework</b>
</p>

A framework that allow build APIs that are agnostic of their exposition, allowing builders to focus on their business logic, functionality and behaviour while forgetting about the technologies to expose those which always are changing. Wrote using SOLID principles and a variety OOP patterns implementations, typescript definitions included.

> Currently in development, breaking changes could be made.

# **Why ?**

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

# **How it works ?**

> Examples are in typescript, if you are using plain javascript omit the types.

**First thing. We need to add the packages need.**

```
yarn add @jems/api-domain @jems/api-core @jems/api-delivery-http-express
```

**@jems/api-domain**

Followind Domain Driven Design (DDD), in this package we will find all the abstraction and constracts related to the domain that are and can be used in API Framework.

**@jems/api-core**

Here we have a basic built in implementation of the api domain.

**@jems/api-delivery-http-express**

This package allow the exposition of the API as RESTful through http using express which is a popular js library for that purpose.

> More delivery service will come. GQL, gRPC and more...

### **Declare and execute your API with a delivery service.**

We use a decarative aproach in which API bulders have to completly declare their APIs arround resources and actions. Take a look to the following code, we will explain it in detail.

``` js

  /**
    * Import the needed dependencies.
    */
  import {
    createApiResponseBuildService,
    createApiRuntime,
  } from "@jems/api-core";
  import { HttpExpressDeliveryService } from "@jems/api-delivery-http-express";
  import { Api } from "@jems/api-domain";

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

  /**
    * Create an api response build service which will simplify the way to create 
    * responses in the API reosuces actions.
    */
  const apiResponseBuildService = createApiResponseBuildService();

  /**
    * Start declaring the API by giving it a name and a version. Using the `Api` type
    * we import from the domain will help to easily declare the API with an IDE IntelliSense.
    */
  const exampleApi: Api = {
    name: "Example API",
    version: "0.0.1",
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
  const builtInApiRuntimeService = createApiRuntime();

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

  start()
```

Thi code is building an API with 2 resources, `users`, and `users statuses`, these resources have actions that the API consumers can call. The users resource have 2 `query` and 1 `get` action while the users statuses resource only have 1 `get` action.

Other important thing to observe is that after declaring the API we create an API `runtime` and register a `delivery service` to deliver our declared api over http using `HttpExpressDeliveryService` a `@jems/api` pluglable package that deliver the declared api through a popular library called express.

All `delivery services` implementations will be opininated in the way of delivering the declared api, in the case of `HttpExpressDeliveryService` it will use a `RESTful` aproach to layout the resources and action, properly maping the action type to an http method.

Runtimes can register infinite number of delivery services meaning you can write a single API and deliver it in all the cool technologies and protocols you like/need at once, giving the options to your consumers to integrate as they see fit.

--

# Roadmap

- Add more documentation (Middlewares, Domain and its types, each delivery service and how they map the declared Api to its technology/protocol)
- Make all validations regarding to resources and actions duplications and content happen on core, guaranty same sanitation and behavior across delivery services.
- Debug tools (Errors, Environements, Stacktraces)
- APIs consumable by direct referece
- No-Op dependencies implementations in the core lib (ie. Console Logging should only hppen if is intended.)
- Logs predefinition. (ie. Pass a log service to a dependency with prefixed logs)
- Remove alias from the resource and compute only based on the name, plus add a description
- Resources linking (Be able to link resources and a way to call multiple acction in a single call, agnostic of technologies and protocols)
- APIs declaration serializable and cross-language. (Figure out how to easily route the resource actions and middlewares chain routines between languages). ie. Define an API in JS, deside to change language, export that API declaration and implemente the rutines in other language.
- Enrish API declaration for auto specs and schemas generation
- Http Express delivery service generate an OpenApi document (useful for auto documentation, playground and http clients generations)
- Create GQL Delivery Service which must auto generate the GQL Schema out the API declaration and auto bind the schema queries and mutations to the resources actions (Should allow GQL clients imeadiatly interact with the API)
- Create gRPC Delivery Service which must auto generate the protocol buffers schema out the API declaration and auto bind the schema methods to the resources actions. (Should allow gRPC clients be auto-created and imeadiatly interact with the API)
- Create Apache Thrift Delivery Service which must auto generate the thrift types file out the API declaration and auto bind the file methods to the resources actions. (Should allow Apache Thrift clients be auto-created and imeadiatly interact with the API)
- Create Web Socket Delivery Service which must auto bind API declaration resources actions to ws calable functions. (Should allow Web Socket clients imeadiatly interact with the API)
