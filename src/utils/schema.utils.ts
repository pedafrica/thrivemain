import { TObject, Type, TypeBuilder } from '@sinclair/typebox'
import { setSchema } from './index.util'
import baseSchema from '../constants/schema.contant'
import { FastifySchema } from 'fastify'

export const getSchema = (
  successRes: TObject | null | (typeof baseSchema)[number]['$id'],
  qty: 'one' | 'many' | null,
  opts: any & { paginate?: boolean } = { paginate: true }
): FastifySchema => {
  const res: any =
    !successRes || typeof successRes == 'string'
      ? { $ref: `${successRes || '2xx'}#` }
      : successRes

  const { paginate, ...rest } = opts
  return setSchema({
    query:
      qty == 'many'
        ? Type.Object({
            page: Type.Optional(Type.String()),
            size: Type.Optional(Type.String()),
            q: Type.Optional(Type.String()),
            sortBy: Type.Optional(Type.String()),
            order: Type.Optional(Type.String()),
            filter: Type.Optional(Type.String()),
          })
        : undefined,
    _2xx:
      qty == 'many'
        ? paginate
          ? Type.Object({
              totalItems: Type.Number(),
              records: Type.Array(res),
              totalPages: Type.Number(),
              currentPage: Type.Number(),
            })
          : Type.Array(res)
        : res,
    param:
      qty == 'one'
        ? Type.Object({
            id: Type.Number(),
          })
        : undefined,

    ...rest,
  })
}

export const constactSchema = Type.Object({
  email: Type.String(),
  name: Type.String(),
  subject: Type.String(),
  message: Type.String(),
})
