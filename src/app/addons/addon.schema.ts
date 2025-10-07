import { Type } from '@sinclair/typebox'

export const addonBody = {
  create: Type.Object({
    name: Type.String(),
    cover: Type.String(),
    slug: Type.String(),
    description: Type.String(),
    price: Type.Number(),
  }),
  get: Type.Object({
    id: Type.Number(),
    name: Type.String(),
    cover: Type.String(),
    slug: Type.String(),
    description: Type.String(),
    price: Type.Number(),

    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
}
