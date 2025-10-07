import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { getRecord, getRecords, success } from "../../utils/index.util";
import { Category, Template } from "./models";
import { templateSchema } from "./template.schema";

// Events Functions
export const doGetTemplates: RouteHandler = async (req) =>
  await getRecords(req, Template, {
    include: { model: Category, as: "category" },
    allowedSearchFields: ["name", "description", "$category.name$"],
  });

export const doGetTemplate: RouteHandler = async (req, rep) =>
  getRecord(req, rep, Template);

export const doCreateTemplate: RouteHandler = async (req, rep) => {
  const { categoryId, ...rest } = req.body as Static<
    typeof templateSchema.create
  >;

  const category = await Category.findByPk(categoryId);

  // @ts-ignore
  if (!category) rep.notFound("Template category not found");

  // @ts-expect-error
  await category.createTemplate({ ...rest, categoryId });

  return success("Template Successfully Created");
};

// Template Category Functions
export const doCreateCategory: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof templateSchema.createCategory
  >;

  let [category, created] = await Category.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Category with same name already exists");

  return success("Template category created");
};

export const doGetCategories: RouteHandler = async (req) =>
  await getRecords(req, Category, { paginate: false });

export const deleteTemplate: RouteHandler<{
  Params: { id: number };
}> = async (req, res) => {
  const { id } = req.params;

  await Template.destroy({ where: { id } });
  return success("Item successfully deleted");
};
