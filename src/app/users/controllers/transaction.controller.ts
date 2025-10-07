import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { txnSchema } from "../schemas/transaction.schema";
import { getRecord } from "../../../utils/index.util";
import { Op } from "sequelize";
import moment from "moment";

export const createTransaction: RouteHandler<{
  Body: Static<typeof txnSchema.create>;
  Params: Static<typeof txnSchema.createParam>;
}> = async (req, rep) => {
  const {
    body: { amount, split_code, plan },
    params: { type },
  } = req;

  if (!["premium", "platinum"].includes(type))
    return rep.badRequest("Invalid transaction type");

  // @ts-ignore
  const txn = await req.initializeTransaction(amount, plan);
  console.log({ txn });

  // @ts-ignore
  await req.userModel!.createTransaction({ amount, ...txn, type });

  return txn;
};

export const getActiveTransaction: RouteHandler = async (req, rep) =>
  getRecord(req, rep, "Transaction", {
    useParams: true,
    isMine: true,
    where: { createdAt: { [Op.gt]: moment().startOf("year") } },
  });

export const verifyTransaction: RouteHandler<{
  Params: Static<typeof txnSchema.verify>;
}> = async (req, rep) => {
  const { reference } = req.params;

  // @ts-ignore
  const txn = await req.models.Transaction.findOne({
    // @ts-ignore
    where: { reference, userId: req.userModel?.dataValues.id },
  });

  if (!txn) throw rep.notFound("Transaction not found");

  // @ts-ignore
  const res = await req.verifyTransaction(reference);

  await txn.update({ status: "success" });

  await txn.reload();

  return txn;
};
