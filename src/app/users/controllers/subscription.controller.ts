import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { success } from "../../../utils/index.util";
import { subSchema } from "../schemas/subscription.schema";
import moment from "moment";

export const createSubscription: RouteHandler<{
  Body: Static<typeof subSchema.create>;
}> = async (req, rep) => {
  const { addons, type, transactionId } = req.body;

  // @ts-ignore
  const txn = await req.userModel.getTransaction({ where: { transactionId } });

  if (!txn) throw rep.notFound("Payment not found");

  // @ts-ignore
  await req.verifyTransaction(txn.reference);

  await txn.update({ status: "success" });

  let amount = 0;
  if (type == "addons") {
    // @ts-ignore
    const foundAddons = await req.models.Addon.findAll({
      where: { id: addons.map((_) => _.id) },
    });
    if (!foundAddons.length) throw rep.notFound("No Addon Found");

    for (let i = 0; i < foundAddons.length; i++)
      amount += foundAddons[i].dataValues.price;

    // @ts-ignore
    await req.models.Subscription.bulkCreate(
      foundAddons.map((_: any) => ({
        addonId: _.dataValues.id,
        transactionId: transactionId,
        type,
        // @ts-expect-error
        userId: req.user.id,
      }))
    );
  } else {
    // @ts-ignore
    await req.models.User.createSubscription({
      type: "premium",
      transactionId: transactionId,
    });
  }
  // @ts-ignore
  // const _txn = await req.initializeTransaction(
  //   // @ts-ignore
  //   req.userModel!.dataValues.email,
  //   amount
  // )

  // @ts-ignore
  // const txn: Model<ITransaction> = req.userModel!.createTransaction(_txn)

  return success("Subscription Successful");
};

export const paymentWebhook: RouteHandler<{
  Body: Static<typeof subSchema.webhook>;
}> = async (req, rep) => {
  const { data, event } = req.body;
  console.log({ check: req.body });

  if (event === "charge.success") {
    // @ts-ignore
    const txn = await req.models.Transaction.findOne({
      where: { reference: data.reference },
    });
    console.log({ txn });

    if (!txn) throw rep.notFound("Payment not found");

    await txn.update({ status: "success" });
    const expiresAt =
      data.plan.interval === "monthly"
        ? moment(data.paid_at).add(1, "month")
        : moment(data.paid_at).add(1, "year");

    // @ts-ignore
    await req.models.Subscription.create({
      type: "premium",
      transactionId: txn.dataValues.id,
      startsAt: data.paid_at,
      expiresAt,
      userId: txn.dataValues.userId,
    });
  }

  return success("Subscription Successful");
};

export const renewSubscription: RouteHandler = async (req, rep) => {
  const { subscriptions: subs, transactionId } = req.body as Static<
    typeof subSchema.renew
  >;

  // @ts-ignore
  const subscriptions = await req.models.Subscription.findAll({
    where: { id: subs },
    // @ts-ignore
    include: { model: req.models.Addon, attributes: { include: ["price"] } },
  });

  let amount = 0;

  if (!subscriptions.length) throw rep.notFound("No Subscription Found");

  for (let i = 0; i < subscriptions.length; i++)
    // @ts-ignore
    amount += subscriptions[i].dataValues.addon.price;

  // // @ts-ignore
  // const _txn = await req.initializeTransaction(
  //   // @ts-ignore
  //   req.userModel!.dataValues.email,
  //   amount
  // )

  // // @ts-ignore
  // const txn: Model<ITransaction> = req.userModel!.createTransaction(_txn)

  // @ts-ignore
  await req.models.Subscription.bulkCreate(
    subscriptions.map(
      ({ dataValues: { expiresAt, startsAt, ...rest } }: any) => ({
        ...rest,
        transactionId: transactionId,
      })
    )
  );

  return success("Subscription Renewal Successful");
};

export const getAddons: RouteHandler = async (req, rep) =>
  // @ts-ignore
  req.userModel!.getAddons();
