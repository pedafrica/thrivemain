import { FastifyInstance } from 'fastify'
import { getVirtualOffice } from '../../../modules/virtual-office/virtualOffice.controller'
import { getRecord, testRoute } from '../../../utils/index.util'
import { getSchema } from '../../../utils/schema.utils'
import { Type } from '@sinclair/typebox'
import { businessSchema } from '../../../app/users/schemas/business.schema'

export default async function (fastify: FastifyInstance) {
  fastify
    .get('/test', testRoute)
    .get(
      '/',
      { schema: getSchema(businessSchema.get, 'one') },
      getVirtualOffice
    )
    .get(
      '/:slug',
      {
        schema: getSchema(businessSchema.get, 'one', {
          params: Type.Object({ slug: Type.String() }),
        }),
      },
      (req, res) => getRecord(req, res, 'Business', { useParams: true })
    )
}
