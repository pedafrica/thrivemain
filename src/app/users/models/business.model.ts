import sequelize from "../../../config/sequelize.config";
import { Static } from "@sinclair/typebox";
import { CreationOptional, ModelDefined, STRING, TEXT } from "sequelize";
import { slugify } from "../../../utils/index.util";
import { businessSchema } from "../schemas/business.schema";
import cloudinary from "../../../config/cloudinary";

export interface IBusiness extends Static<typeof businessSchema.create> {
  id: CreationOptional<number>;
  userId: CreationOptional<number>;
}

const Business: ModelDefined<IBusiness, {}> = sequelize.define("business", {
  name: { type: STRING, allowNull: false, unique: true },
  email: { type: STRING, allowNull: false },
  phone: { type: STRING, allowNull: false },
  whatsappNumber: { type: STRING, allowNull: true },
  country: { type: STRING, allowNull: false },
  address: { type: STRING, allowNull: false },
  state: { type: STRING, allowNull: false },
  bio: { type: TEXT, allowNull: false },
  cover: {
    type: STRING,
    allowNull: true,
    get() {
      const { cover } = this.dataValues;
      return cloudinary.url(cover || "cover");
    },
  },
  cac: {
    type: STRING,
    allowNull: true,
    get() {
      const { cac } = this.dataValues;

      return cac ? cloudinary.url(cac) : cac;
    },
  },
  logo: {
    type: STRING,
    allowNull: true,
    get() {
      const { logo } = this.dataValues;

      return logo ? cloudinary.url(logo) : logo;
    },
  },
  govId: {
    type: STRING,
    allowNull: true,
    get() {
      const { govId } = this.dataValues;

      return govId ? cloudinary.url(govId) : govId;
    },
  },
  twitterLink: { type: STRING, allowNull: true },
  facebookLink: { type: STRING, allowNull: true },
  instagramLink: { type: STRING, allowNull: true },
  linkedinLink: { type: STRING, allowNull: true },

  designation: { type: STRING, allowNull: true },
  taxId: { type: STRING, allowNull: true },
  validId: { type: STRING, allowNull: true },
  vAddress: { type: STRING, allowNull: true },

  slug: {
    type: STRING,
    unique: true,
    allowNull: false,
    set(value: string) {
      this.setDataValue("slug", value || slugify(this.dataValues.name));
    },
    get() {
      const { slug } = this.dataValues;

      return `${process.env.CLIENT_BASE_URL}/${slug}`;
    },
  },
});

export default Business;
