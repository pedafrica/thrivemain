import { Type } from "@sinclair/typebox";

export const adminBusinessSchema = {
  getRes: Type.Object({
    name: Type.String({ minLength: 3 }),
    description: Type.String({ minLength: 150 }),
    slug: Type.String({ minLength: 5 }),
    cacRegNum: Type.String(),
    taxId: Type.String(),
    country: Type.String(),
    state: Type.String(),
    address: Type.String(),
    email: Type.String({ format: "email" }),
    phone: Type.String(),
    industry: Type.String(),
    incorpDate: Type.String({ format: "date" }),
    logo: Type.String(),
    coverImage: Type.String(),
    projectPartner: Type.String(),
    social_twitter: Type.String(),
    social_facebook: Type.String(),
    social_instagram: Type.String(),
    social_linkedin: Type.String(),
    social_tiktok: Type.String(),
    userId: Type.Number(),
  }),

  getBody: Type.Object({
    userId: Type.Number(),
  }),
};
