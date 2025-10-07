import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { getRecord, slugify, success } from "../../../utils/index.util";
import { businessSchema } from "../schemas/business.schema";

export const createBusiness: RouteHandler<{
  Body: Static<typeof businessSchema.create>;
}> = async (req, rep) => {
  const { reference, ...rest } = req.body;
  console.log({ req });

  /* ---- Check For Business Duplicate ---- */
  // @ts-expect-error
  if (await req.userModel!.getBusiness())
    rep.conflict("This account already has a business");

  // const {
  //   data: { amount, status },
  // } = (await req.verifyTransaction(reference)).data

  // let txn = await req.models.Transaction.findOne({
  //   where: { reference, userId: req.userModel?.dataValues.id },
  // })
  // if (txn) await txn.update({ status })
  // else {
  //   // @ts-ignore
  //   txn = await req.userModel!.createTransaction({
  //     amount,
  //     status,
  //     reference,
  //   })
  // }

  // await req.models.Subscription.create({
  //   type: 'premium',
  //   transactionId: txn!.dataValues.id,
  //   userId: req.userModel?.dataValues.id,
  // })

  // @ts-expect-error
  await req.userModel!.createBusiness({ ...rest, slug: slugify(rest.name) });

  return success("You business profile has been created");
};

export const updateBusiness: RouteHandler = async (req, rep) => {
  const { ...rest } = req.body as Static<typeof businessSchema.update>;

  // @ts-expect-error
  const business = await req.userModel.getBusiness();
  if (!business) throw rep.notFound("Business profile does not exist");

  await business.update(rest);

  return success("You business profile has been updated");
};

export const getMyBusiness: RouteHandler = async (req, rep) => {
  // @ts-expect-error
  const business = await req.userModel!.getBusiness();

  return business;
};

export const getBusiness: RouteHandler = async (req, rep) =>
  getRecord(req, rep, "Business");
