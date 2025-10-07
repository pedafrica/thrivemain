import { Type } from '@sinclair/typebox'
import { userSchema } from '../../app/users/schemas/user.schema'

export const getCategory = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.Optional(Type.String()),

    // createdAt: Type.String({ format: 'date-time' }),
    // updatedAt: Type.String({ format: 'date-time' }),
  }),
  healthSchema = {
    create: Type.Object({
      name: Type.String(),
      url: Type.String(),
      categoryId: Type.Number(),
      institutionId: Type.Number(),
      description: Type.String(),
      isPlatinum: Type.Optional(Type.Boolean()),
      cover: Type.Optional(Type.String()),
    }),
    createInstitution: Type.Object({
      email: Type.String(),
      phone: Type.String(),
      name: Type.String(),
      url: Type.Optional(Type.String()),
      logo: Type.Optional(Type.String()),
      cover: Type.String(),
      bio: Type.Optional(Type.String()),
    }),
    createCategory: Type.Object({
      name: Type.String(),
      description: Type.Optional(Type.String()),
    }),
    createApplication: Type.Object({
      serviceId: Type.Number(),
    }),
    getInstitution: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      url: Type.Optional(Type.String()),
      logo: Type.Optional(Type.String()),
      cover: Type.String(),
      bio: Type.Optional(Type.String()),
      categories: Type.Any(),
      services: Type.Any(),

      // createdAt: Type.String({ format: 'date-time' }),
      // updatedAt: Type.String({ format: 'date-time' }),
    }),
    get: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      description: Type.String(),
      category: getCategory,
      url: Type.Optional(Type.String()),
      isPlatinum: Type.Optional(Type.Boolean()),
      cover: Type.Optional(Type.String()),
      institution: Type.Any(),

      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' }),
    }),
    getCategory,
    getApplcation: Type.Object({
      id: Type.Number(),
      user: userSchema.get,

      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' }),
    }),
  }
