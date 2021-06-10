import {
    createApiRuntime
} from "@jems/api-core";
import { ExpressActionDeliveryService } from "@jems/api-delivery-http-express";
import { Api } from "@jems/api-domain";


const api: Api = {
  name: "Sanbox Api",
  version: "1.0",
  resources: [
    {
      alias: "resource",
      name: "Resource",
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
