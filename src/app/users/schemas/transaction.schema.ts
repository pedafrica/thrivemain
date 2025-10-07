import { Type } from "@sinclair/typebox";

export const txnSchema = {
  create: Type.Object({
    amount: Type.Number(),
    split_code: Type.Optional(Type.String()),
    plan: Type.Optional(Type.String()),
  }),
  createParam: Type.Object({
    type: Type.String(),
  }),
  getParam: Type.Object({
    type: Type.String(),
    status: Type.String(),
  }),
  createRes: Type.Object({
    reference: Type.Optional(Type.String()),
  }),
  update: Type.Object({
    status: Type.String(),
    reference: Type.Optional(Type.String()),
  }),
  verify: Type.Object({
    reference: Type.String(),
  }),
  get: Type.Object({
    id: Type.Number(),
    reference: Type.String(),
    amount: Type.String(),
    type: Type.String(),
    status: Type.String(),
  }),
};
