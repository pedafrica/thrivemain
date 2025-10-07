import { Type } from "@sinclair/typebox";
import { userSchema } from "../../app/users/schemas/user.schema";

export const getCategory = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.Optional(Type.String()),

    // createdAt: Type.String({ format: 'date-time' }),
    // updatedAt: Type.String({ format: 'date-time' }),
  }),
  getOrganizer = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    website: Type.Optional(Type.String()),
    bio: Type.Optional(Type.String()),
  }),
  eventSchema = {
    create: Type.Object({
      name: Type.String(),
      amount: Type.Number(),
      discout: Type.Optional(Type.Number()),
      discountType: Type.Optional(Type.String()),
      isPlatinum: Type.Optional(Type.Boolean()),
      url: Type.Optional(Type.String()),
      cover: Type.Optional(Type.String()),
      startDate: Type.String({ format: "date-time" }),
      endDate: Type.String({ format: "date-time" }),
      description: Type.String(),
      categoryId: Type.Number(),
      organizerId: Type.Number(),
    }),
    get: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      amount: Type.Number(),
      discout: Type.Optional(Type.Number()),
      discountType: Type.Optional(Type.String()),
      isPlatinum: Type.Optional(Type.Boolean()),
      url: Type.Optional(Type.String()),
      cover: Type.String(),
      startDate: Type.String({ format: "date-time" }),
      endDate: Type.String({ format: "date-time" }),
      description: Type.String(),
      location: Type.String(),
      category: getCategory,
      organizer: getOrganizer,

      createdAt: Type.String({ format: "date-time" }),
      updatedAt: Type.String({ format: "date-time" }),
    }),

    createCategory: Type.Object({
      name: Type.String(),
      description: Type.Optional(Type.String()),
    }),

    getCategory,
    createApplication: Type.Object({
      eventId: Type.Number(),
    }),

    getApplcation: Type.Object({
      id: Type.Number(),
      user: userSchema.get,

      createdAt: Type.String({ format: "date-time" }),
      updatedAt: Type.String({ format: "date-time" }),
    }),
    createOrganizer: Type.Object({
      name: Type.String(),
      website: Type.Optional(Type.String()),
      bio: Type.Optional(Type.String()),
    }),

    getOrganizer,
    apply: Type.Object({
      userId: Type.String(),
      createdAt: Type.String({ format: "date-time" }),
      updatedAt: Type.String({ format: "date-time" }),
    }),
  };
