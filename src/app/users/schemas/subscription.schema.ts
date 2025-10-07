import { Type } from "@sinclair/typebox";

export const subSchema = {
  create: Type.Object({
    addons: Type.Array(
      Type.Object({
        id: Type.Number(),
      })
    ),
    type: Type.String({ examples: ["basic", "addon"] }),
    transactionId: Type.Number(),
    startsAt: Type.Optional(Type.String()),
    expiresAt: Type.Optional(Type.String()),
  }),
  renew: Type.Object({
    subscriptions: Type.Array(Type.Number()),
    transactionId: Type.Number(),
  }),
  webhook: Type.Object({
    event: Type.String(),
    data: Type.Object({
      reference: Type.String(),
      status: Type.String(),
      paid_at: Type.String(),
      plan: Type.Any(),
    }),
  }),
};
