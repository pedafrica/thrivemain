import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { setSchema, testRoute } from "../../../utils/index.util";
import {
  doCreateApplication,
  doCreateCategory,
  doCreateOrganizer,
  doCreateEvent,
  doGetApplications,
  doGetCategories,
  doGetOrganizers,
  doGetEvent,
  doGetEvents,
  doGetApplication,
  doGetOrganizer,
  deleteEvent,
} from "../event.controller";
import { eventSchema } from "../event.schema";
import { getSchema } from "../../../utils/schema.utils";

export default async function (fastify: FastifyInstance) {
  const {
    getOrganizer,
    createOrganizer,
    create,
    get,
    getApplcation,
    createApplication,
    getCategory,
    createCategory,
  } = eventSchema;

  fastify
    .addHook("preHandler", fastify.authenticate)
    .get("/test", testRoute)
    // Application Routes
    .get(
      "/:eventId/applications",
      {
        schema: getSchema(getApplcation, "many", {
          params: Type.Object({
            eventId: Type.Number(),
          }),
        }),
      },
      doGetApplications
    )
    .post(
      "/:eventId/apply",
      {
        schema: getSchema("2xx", "one", {
          withAuth: true,
          params: createApplication,
        }),
      },
      doCreateApplication
    )
    .get(
      "/application/:id",

      {
        schema: getSchema(get, "one", {
          params: Type.Object({
            id: Type.Number(),
          }),
        }),
      },
      doGetApplication
    )

    // Events Routes
    .get(
      "/",
      {
        schema: getSchema(get, "many"),
      },
      doGetEvents
    )
    .post(
      "/",
      {
        schema: getSchema("2xx", "one", { body: create }),
      },
      doCreateEvent
    )
    .get(
      "/:id",

      {
        schema: getSchema(get, "one", {
          params: Type.Object({
            id: Type.Number(),
          }),
        }),
      },
      doGetEvent
    )

    // Categories Routes
    .get(
      "/categories",
      {
        schema: getSchema(getCategory, "many", {
          paginate: false,
        }),
      },
      doGetCategories
    )
    .post(
      "/categories",
      {
        schema: getSchema("2xx", "one", { body: createCategory }),
      },
      doCreateCategory
    )

    // Institution Routes
    .get(
      "/organizers",
      {
        schema: getSchema(getCategory, "many", {
          paginate: false,
        }),
      },
      doGetOrganizers
    )
    .post(
      "/organizers",
      {
        schema: getSchema("2xx", "one", { body: createOrganizer }),
      },
      doCreateOrganizer
    )
    .get(
      "/organizers/:id",

      {
        schema: getSchema(getOrganizer, "one", {
          params: Type.Object({
            id: Type.Number(),
          }),
        }),
      },
      doGetOrganizer
    )
    .delete("/:id", deleteEvent);
}
