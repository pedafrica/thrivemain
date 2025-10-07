import { Static } from "@sinclair/typebox";
import { genSaltSync, hashSync } from "bcryptjs";
import {
  DATE,
  DATEONLY,
  ENUM,
  INTEGER,
  ModelDefined,
  STRING,
  TEXT,
  VIRTUAL,
} from "sequelize";
import cloudinary from "../../../config/cloudinary";
import sequelize from "../../../config/sequelize.config";
import { userSchema } from "../schemas/user.schema";
import moment from "moment";

export interface IUser extends Static<(typeof userSchema)["get"]> {
  password: string;
  tokens?: string;
  emailVerifiedAt: string | null;
}

// User schema
const User: ModelDefined<IUser, {}> = sequelize.define(
  "user",
  {
    firstName: { type: STRING, allowNull: false },
    lastName: { type: STRING, allowNull: false },
    username: { type: STRING, allowNull: true },
    email: { type: STRING, allowNull: false },
    password: { type: STRING, allowNull: false },
    dob: { type: DATEONLY, allowNull: true },
    phone: { type: STRING, allowNull: true },
    icssId: { type: STRING, allowNull: true },
    address: { type: STRING, allowNull: true },
    avatarUrl: {
      type: STRING,
      allowNull: true,

      get() {
        let { avatarUrl, gender } = this.dataValues;

        return cloudinary.url(
          avatarUrl || (gender == "male" ? "male_avatar" : "female_avatar"),
          {
            width: 200,
            height: 200,
            Crop: "fill",
          }
        );
      },
    },
    bio: { type: TEXT, allowNull: true },
    gender: { type: ENUM("female", "male", "others"), allowNull: true },
    phoneVerifiedAt: { type: DATE, allowNull: true },
    tokens: {
      type: STRING,
      allowNull: false,
      defaultValue: "cat",
      get() {
        return this.getDataValue("tokens")?.split(";");
      },
      set(val: string[]) {
        this.setDataValue("tokens", val.join(";"));
      },
    },
    fullName: {
      type: VIRTUAL,
      get() {
        return `${this.dataValues.firstName} ${this.dataValues.lastName}`;
      },
    },
    isApproved: {
      type: VIRTUAL,
      get() {
        return this.dataValues.status === "approved";
      },
    },
    hasSubscription: {
      type: VIRTUAL,
      get() {
        // @ts-ignore
        return moment()
          .subtract(30, "days")
          .isBefore(this.dataValues.createdAt);
      },
      // set(value) {
      //   throw new Error('Do not try to set the `fullName` value!')
      // },
    },
    emailVerifiedAt: { type: DATE, allowNull: true },
    accountVerifiedAt: { type: DATE, allowNull: true },
    status: {
      type: ENUM("pending", "approved", "declined"),
      defaultValue: "approved",
    },
  },
  {
    hooks: {
      beforeSave: (user) => {
        // @ts-expect-error
        if (user.changed("password"))
          user.dataValues.password = hashSync(
            user.dataValues.password,
            genSaltSync(10)
          );

        // @ts-expect-error
        if (user.changed("phone")) user.dataValues.phoneVerified = false;
        return;
      },
    },
    defaultScope: { attributes: { exclude: ["tokens"] } },
    indexes: [{ unique: true, fields: ["email", "username"] }],
  }
);

export default User;
