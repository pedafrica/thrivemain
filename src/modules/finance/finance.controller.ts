import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { getRecord, getRecords, success } from "../../utils/index.util";

import { financeSchema } from "./finance.schema";
import { Category, Service, Institution } from "./models";
import Application from "./models/application.model";
import FinacialService from "./models/service.model";
import FinancialInstitution from "./models/institution.model";

export const doGetServices: RouteHandler = async (req) =>
  await getRecords(req, FinacialService, {
    include: [
      { model: Category, as: "category" },
      { model: FinancialInstitution, as: "institution" },
    ],
    allowedSearchFields: ["name", "$category.name$", "$institution.name$"],
    allowedFillters: ["categoryId", "institutionId"],
  });

export const doGetInstitutions: RouteHandler = async (req) =>
  await getRecords(req, Institution, { paginate: false });

export const doGetInstitution: RouteHandler = async (req, rep) =>
  getRecord(req, rep, Institution);

export const doCreateService: RouteHandler = async (req, rep) => {
  const { institutionId, categoryId, ...rest } = req.body as Static<
    typeof financeSchema.create
  >;

  const institution = await Institution.findByPk(institutionId);

  // @ts-ignore
  if (!institution) rep.notFound("Institution Not Found");

  const category = await Category.findByPk(categoryId);

  // @ts-ignore
  if (!category) rep.notFound("Category Not Found");

  await FinacialService.create({ ...rest, categoryId, institutionId });

  return success("Finacial Service Created");
};

export const doCreateInstitution: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<typeof financeSchema.create>;

  // @ts-ignore
  let [institution, created] = await Institution.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Institution with same name already exists");

  return success("Finacial Institution Added");
};

export const doCreateCategory: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<typeof financeSchema.create>;

  // @ts-ignore
  let [institution, created] = await Category.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Institution with same name already exists");

  return success("Finacial Institution Added");
};

export const doCreateApplication: RouteHandler = async (req, rep) => {
  const { serviceId } = req.params as Static<
    typeof financeSchema.createApplication
  >;

  // @ts-ignore
  const service = await Service.findByPk(serviceId);
  // @ts-ignore
  if (!service) rep.notFound("Service not found");

  // @ts-ignore
  // await service!.addUser(req.models.User, { through: Application });
  await Application.create({
    serviceId,
    userId: req.userModel?.dataValues.id,
  });
  return success("Application successful");
};

export const doGetService: RouteHandler = async (req, rep) =>
  await getRecord(req, rep, Service, { useParams: true });

export const doGetCategories: RouteHandler = async (req) =>
  await getRecords(req, Category, { paginate: false });

export const doGetApplcation: RouteHandler = async (req) =>
  await getRecords(req, Application, { useParams: true });

export const deleteFinance: RouteHandler<{
  Params: { id: number };
}> = async (req, res) => {
  const { id } = req.params;

  await FinacialService.destroy({ where: { id } });
  return success("Item successfully deleted");
};
