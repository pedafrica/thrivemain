import sequelize from "../../../config/sequelize.config";
import { Static } from "@sinclair/typebox";
import { CreationOptional, ModelDefined, STRING, TEXT } from "sequelize";
import { virtualOfficeSchema } from "../virtualOffice.schema";
import cloudinary from "../../../config/cloudinary";

export interface IVOffice extends Static<typeof virtualOfficeSchema.create> {
  vAddress: string;
  id: CreationOptional<number>;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

const VirtualOffice: ModelDefined<IVOffice, {}> = sequelize.define(
  "virtualOffice",
  {
    name: { type: STRING, allowNull: false },
    address: { type: STRING, allowNull: false },
    designation: { type: STRING, allowNull: false },
    taxId: { type: STRING, allowNull: false },
    cac: { type: STRING, allowNull: false },
    validId: {
      type: STRING,
      allowNull: false,
      get() {
        const { validId } = this.dataValues;
        return cloudinary.url(validId || "cover");
      },
    },
    vAddress: { type: STRING, allowNull: true },
  },
  { indexes: [{ unique: true, fields: ["name", "taxId"] }] }
);

export default VirtualOffice;
