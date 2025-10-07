import sequelize from "../../../config/sequelize.config";
import moment from "moment";
import { CreationOptional, DATEONLY, ENUM, ModelDefined, NOW } from "sequelize";
import { uppercaseFirst } from "../../../utils/index.util";

export interface ISub {
  startsAt?: Date;
  expiresAt?: Date;
  type: "basic" | "addon";

  id: CreationOptional<number>;
  userId: CreationOptional<number>;
  transactionId: CreationOptional<number>;
  addonId: CreationOptional<number>;
}

const Subscription: ModelDefined<ISub, {}> = sequelize.define(
  "subscription",
  {
    startsAt: { type: DATEONLY, allowNull: false, defaultValue: NOW },
    expiresAt: {
      type: DATEONLY,
      allowNull: false,
      defaultValue: () => moment().add(1, "months").format("YYYY-MM-DD"),
    },
    type: { type: ENUM("platinum", "premium", "addon") },
  },
  {
    timestamps: false,
  }
);

// Subscription.prototype.getSubscribeable = function (options: any) {
//   if (!this.type) return Promise.resolve(null)
//   const mixinMethodName = `get${uppercaseFirst(this.type)}`
//   return this[mixinMethodName](options)
// }
export default Subscription;
