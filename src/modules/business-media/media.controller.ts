import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { getRecord, getRecords, success } from "../../utils/index.util";
import { Category, Media } from "./models";
import { mediaSchema } from "./media.schema";

// Events Functions
export const doGetMedias: RouteHandler = async (req) =>
  await getRecords(req, Media, {
    include: { model: Category, as: "category" },
    allowedSearchFields: ["name", "description", "$category.name$"],
  });

export const doGetMedia: RouteHandler = async (req, rep) =>
  getRecord(req, rep, Media);

export const doCreateMedia: RouteHandler = async (req, rep) => {
  const { categoryId, ...rest } = req.body as Static<typeof mediaSchema.create>;

  const category = await Category.findByPk(categoryId);

  // @ts-ignore
  if (!category) rep.notFound("Media category not found");

  await Media.create({ ...rest, categoryId });

  return success("Media Successfully Created");
};

// Media Category Functions
export const doCreateCategory: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof mediaSchema.createCategory
  >;

  let [category, created] = await Category.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Category with same name already exists");

  return success("Media category created");
};

export const doGetCategories: RouteHandler = async (req) =>
  await getRecords(req, Category, { paginate: false });

export const deleteMedia: RouteHandler<{
  Params: { id: number };
}> = async (req, res) => {
  const { id } = req.params;

  await Media.destroy({ where: { id } });
  return success("Item successfully deleted");
};
