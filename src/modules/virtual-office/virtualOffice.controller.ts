import { RouteHandler } from "fastify";
import { virtualOfficeSchema } from "./virtualOffice.schema";
import { getRecord, success } from "../../utils/index.util";
import { Static } from "@sinclair/typebox";
import VirtualOffice from "./models/virtualOffice.model";

export const createVirtualOffice: RouteHandler<{
  Body: Static<(typeof virtualOfficeSchema)["create"]>;
}> = async (req, rep) => {
  const { ...rest } = req.body;
  console.log(rest);

  // const { validId = '_', cac = '_' } = {}

  // if (cac) rest.cac = cac[0].path

  // if (validId) rest.validId = validId[0].path

  // @ts-ignore
  await VirtualOffice.create({ ...rest, userId: req.user.id, cac: "_" });

  return success("Your application for a virtual office has been submitted");
};

export const approveVirtualOffice: RouteHandler<{
  Params: Static<(typeof virtualOfficeSchema)["approve"]>;
  Body: { vAddress: string };
}> = async (req, rep) => {
  const vOffice = await VirtualOffice.findByPk(req.params.id);

  if (!vOffice) rep.notFound("Virtual officev not found");

  await vOffice?.update({ vAddress: req.body.vAddress });

  return success("Virtual office has been approved");
};

export const getVirtualOffice: RouteHandler = (req, rep) =>
  // @ts-ignore
  req.userModel!.hasVirtualOffice()
    ? // @ts-ignore
      req.userModel.getVirtualOffice()
    : rep.notFound("You do not have a virtual office yet");
