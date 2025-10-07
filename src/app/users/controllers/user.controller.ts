import { Static } from "@sinclair/typebox";
import { RouteHandlerMethod } from "fastify";
import { success } from "../../../utils/index.util";
import { userSchema } from "../schemas/user.schema";

export const getUser: RouteHandlerMethod = async (req, rep) =>
  // @ts-ignore
  req.userModel;

export const updateProfile: RouteHandlerMethod = async (req, rep) => {
  const { ...rest } = req.body as Static<typeof userSchema.update>;
  console.log({ ...rest });
  // @ts-ignore
  await req.userModel?.update(rest);

  return success("Profile Updated");
};

export const doCreateNgo: RouteHandlerMethod = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof userSchema.createCategory
  >;
  // @ts-ignore
  let [event, created] = await req.models.Ngo.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Ngo with same name already exists");

  return success("NGO added");
};

export const doCreateIndustry: RouteHandlerMethod = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof userSchema.createCategory
  >;
  // @ts-ignore
  let [event, created] = await req.models.Industry.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Industry with same name already exists");

  return success("Industry added");
};
