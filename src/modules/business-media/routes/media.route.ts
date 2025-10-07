import { Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { testRoute } from "../../../utils/index.util";
import { getSchema } from "../../../utils/schema.utils";
import {
  deleteMedia,
  doCreateCategory,
  doCreateMedia,
  doGetCategories,
  doGetMedia,
  doGetMedias,
} from "../media.controller";
import { mediaSchema } from "../media.schema";

export default async function (fastify: FastifyInstance) {
  const { create, get, getCategory, createCategory } = mediaSchema;

  fastify
    .get("/test", testRoute)

    // Media Routes
    .get(
      "/library",
      {
        schema: getSchema(get, "many"),
      },
      doGetMedias
    )
    .post(
      "/",
      {
        schema: getSchema("2xx", "one", { body: create }),
      },
      doCreateMedia
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
      doGetMedia
    )
    .delete("/:id", deleteMedia)

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
