import { getBusinsesses } from '../../../../app/admin/controllers/business.controller'
import { adminBusinessSchema } from '../../../../app/admin/schemas/business.schems'
import { FastifyInstance } from 'fastify'
import { getSchema } from '../../../../utils/schema.utils'

export default async function (fastify: FastifyInstance) {
  const { getRes } = adminBusinessSchema
  fastify.get(
    '/businesses',
    { schema: getSchema(getRes, 'many') },
    getBusinsesses
  )
}
