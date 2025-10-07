import { FastifyInstance } from "fastify";
import { testRoute } from "../../../utils/index.util";
import {
  createSubscription,
  paymentWebhook,
  renewSubscription,
} from "../controllers/subscription.controller";
import { getSchema } from "../../../utils/schema.utils";
import { subSchema } from "../schemas/subscription.schema";

export default async function (fastify: FastifyInstance) {
  fastify
    .get("/subscription", testRoute)
    // @ts-ignore
    .addHook("preHandler", fastify.authenticate)
    .post(
      "/subscription",
      { schema: getSchema("2xx", "one", { body: subSchema.create }) },
      createSubscription
    )

    .post(
      "/renew-subscription",
      { schema: getSchema("2xx", "one", { body: subSchema.renew }) },
      renewSubscription
    );
}
