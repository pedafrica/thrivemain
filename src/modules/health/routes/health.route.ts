import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { setSchema, testRoute } from "../../../utils/index.util";
import {
  deleteHealth,
  doCreateApplication,
  doCreateCategory,
  doCreateInstitution,
  doCreateService,
  doGetApplcation,
  doGetCategories,
  doGetInstitution,
  doGetInstitutions,
  doGetService,
  doGetServices,
} from "../health.controller";
import { healthSchema } from "../health.schema";
import { getSchema } from "../../../utils/schema.utils";

export default async function (fastify: FastifyInstance) {
  const {
    getInstitution,
    createInstitution,
    create,
    get,
    getApplcation,
    createApplication,
    getCategory,
    createCategory,
  } = healthSchema;

  fastify
    .addHook("preHandler", fastify.authenticate)
    .get("/test", testRoute)

    // Application Routes
    .get(
      "/services/:serviceId/applications",
      {
        schema: getSchema(getApplcation, "many", {
          params: Type.Object({
            serviceId: Type.Number(),
          }),
        }),
      },
      doGetApplcation
    )
    .post(
      "/services/:serviceId/apply",
      {
        schema: getSchema("2xx", "one", {
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
      doGetService
    )

    // Services Routes
    .get(
      "/services",
      {
        schema: getSchema(get, "many"),
      },
      doGetServices
    )
    .post(
      "/services",
      {
        schema: getSchema("2xx", "one", { body: create }),
      },
      doCreateService
    )
    .get(
      "/services/:id",

      {
        schema: getSchema(get, "one", {
          params: Type.Object({
            id: Type.Number(),
          }),
        }),
      },
      doGetService
    )

    // Institution Routes
    .get(
      "/categories",
      {
        schema: getSchema(getCategory, "many", { paginate: false }),
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
      "/institutions",
      {
        schema: getSchema(getInstitution, "many"),
      },
      doGetInstitutions
    )
    .post(
      "/institutions",
      {
        schema: getSchema("2xx", "one", { body: createInstitution }),
      },
      doCreateInstitution
    )
    .get(
      "/institutions/:id",

      {
        schema: getSchema(getInstitution, "one", {
          params: Type.Object({
            id: Type.Number(),
          }),
        }),
      },
      doGetInstitution
    )
    .delete("/:id", deleteHealth);
}
