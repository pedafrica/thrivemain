import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { testRoute } from "../../../utils/index.util";
import { getSchema } from "../../../utils/schema.utils";
import {
  deleteTemplate,
  doCreateCategory,
  doCreateTemplate,
  doGetCategories,
  doGetTemplate,
  doGetTemplates,
} from "../template.controller";
import { templateSchema } from "../template.schema";

export default async function (fastify: FastifyInstance) {
  const { create, get, getCategory, createCategory } = templateSchema;

  fastify
    .get("/test", testRoute)

    // Template Routes
    .get(
      "/library",
      {
        schema: getSchema(get, "many"),
      },
      doGetTemplates
    )
    .post(
      "/",
      {
        schema: getSchema("2xx", "one", { body: create }),
      },
      doCreateTemplate
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
      doGetTemplate
    )
    .delete("/:id", deleteTemplate)

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
    );
}
