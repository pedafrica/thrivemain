import { Type } from '@sinclair/typebox'

export const getCategory = Type.Object({
    id: Type.Number(),
    name: Type.String(),
    description: Type.Optional(Type.String()),

    // createdAt: Type.String({ format: 'date-time' }),
    // updatedAt: Type.String({ format: 'date-time' }),
  }),
  mediaSchema = {
    create: Type.Object({
      categoryId: Type.Number(),
      name: Type.String(),
      description: Type.String(),
      mediaUrl: Type.String(),
      format: Type.String(),
      isPlatinum: Type.Optional(Type.Boolean()),
      metadata: Type.Object({
        bytes: Type.Number(),
        height: Type.Optional(Type.Number()),
        width: Type.Optional(Type.Number()),
      }),
    }),
    createCategory: Type.Object({
      name: Type.String(),
      description: Type.Optional(Type.String()),
    }),
    get: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      description: Type.String(),
      mediaUrl: Type.String(),
      format: Type.String(),
      isPlatinum: Type.Boolean(),
      metadata: Type.Object({
        bytes: Type.Number(),
        height: Type.Optional(Type.Number()),
        width: Type.Optional(Type.Number()),
      }),

      category: getCategory,
      createdAt: Type.String({ format: 'date-time' }),
      updatedAt: Type.String({ format: 'date-time' }),
    }),
    getCategory,
  }
