import { userSearchFilters } from "../../../constants/filters.constant";
import { RouteHandler } from "fastify";
import {
  dateTimeNow,
  getRecord,
  getRecords,
  success,
} from "../../../utils/index.util";
import { Business, Ngo, Role, User, VirtualOffice } from "../../users/models";

export const getUsersPendingApproval: RouteHandler = async (req, res) =>
  await getRecords(req, "User", {
    allowedSearchFields: userSearchFilters,
  });

export const getApprovedUsers: RouteHandler = async (req, res) =>
  await getRecords(req, "User", {});

export const declineUser: RouteHandler = async (req, rep) => {
  const { id } = req.params as any;

  // @ts-ignore
  const user = await req.models.User.findOne({ where: { id } });

  if (!user) throw rep.notFound("User not found, pls try again");

  // @ts-ignore
  const updated = await user.update({ status: "declined" }, { where: { id } });

  if (!updated)
    throw rep.expectationFailed("Failed to approve this user, pls try again");

  //@ts-ignore
  rep.sendMail({
    //@ts-ignore
    body: `Hello ${user.dataValues.firstName} <br/><br/> Your application to Thrive has been regretably declined as we were not able to verify your membership. <br/><br/>
    Regards,<br/>
    Thrive Team `,
    //@ts-ignore
    to: user.dataValues.email,
    subject: "Application Delined",
  });

  return success("User application declined");
};

export const approveUser: RouteHandler = async (req, rep) => {
  const { id } = req.params as any;

  // @ts-ignore
  const user = await req.models.User.findOne({ where: { id } });

  if (!user) throw rep.notFound("User not found, pls try again");

  // @ts-ignore
  const updated = await user.update(
    { accountVerifiedAt: dateTimeNow(), status: "approved" },
    { where: { id } }
  );

  if (!updated)
    throw rep.expectationFailed("Failed to approve this user, pls try again");

  //@ts-ignore
  rep.sendMail({
    //@ts-ignore
    body: `Hello ${user.dataValues.firstName} <br/><br/> Welcome again, Your account has be succesfully approved. <br/><br/>
    Regards,<br/>
    Thrive Team `,
    //@ts-ignore
    to: user.dataValues.email,
    subject: "Welcome To Thrive",
  });

  return success("User account successfully approved");
};

export const suspendUser: RouteHandler = async (req, rep) => {
  const { id } = req.params as any;

  // @ts-ignore
  const user = await req.models.User.findOne({ where: { id } });

  if (!user) throw rep.notFound("User not found, pls try again");

  // @ts-ignore
  const updated = await user.update({ status: "pending" }, { where: { id } });

  if (!updated)
    throw rep.expectationFailed("Failed to suspend this user, pls try again");

  //@ts-ignore
  rep.sendMail({
    //@ts-ignore
    body: `Hello ${user.dataValues.firstName} <br/><br/> Your application to Thrive has been regretably declined as we were not able to verify your membership. <br/><br/>
    Regards,<br/>
    Thrive Team `,
    //@ts-ignore
    to: user.dataValues.email,
    subject: "Application Suspended",
  });

  return success("User application Suspended");
};

export const getUsers: RouteHandler<{
  Querystring: { filter?: string; filterBy?: string };
}> = async (req, res) => {
  const hasPremiumSub = req.query?.filter === "hasPremiumSub";

  if (hasPremiumSub) {
    delete req.query.filter;
    delete req.query.filterBy;
  }

  const rec = await getRecords(req, "User", {
    allowedSearchFields: userSearchFilters,
    allowedFillters: ["ngoId", "status"],
    // attributes: {
    //   // // include: [[literal('DISTINCT "premuimSub"."userId"'), "premSubId"]],
    //   // // include: [[literal('DISTINCT "id"'), "userId"]],
    //   // include: [[Sequelize.fn("DISTINCT", Sequelize.col("id")), "id"]],
    // },
    include: [
      { model: Ngo },
      { model: Role },
      {
        model: Business,
        // association: 'premuimSub',
        // required: hasPremiumSub,
      },
    ],
    order: [["id", "DESC"]],
  });
  // console.log({ rec, dec: rec?.records, userSearchFilters });

  return rec;
};

export const getUserBusinsess: RouteHandler = async (req, rep) =>
  getRecord(req, rep, "Business", { useParams: true });

export const adminGetUser: RouteHandler<{
  Params: { userId: number };
}> = async (req, rep) =>
  getRecord(req, rep, "User", {
    useParams: true,
    include: [{ model: Business }, { model: VirtualOffice }],
  });

export const membersCount: RouteHandler = async (req, rep) => {
  // @ts-ignore
  const count = await User.count({
    // @ts-ignore
    include: { model: Business, required: true },
  });

  return { count };
};
