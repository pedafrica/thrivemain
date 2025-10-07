import { FastifyInstance } from 'fastify'
import { testRoute } from '../../../utils/index.util'
import { getSchema } from '../../../utils/schema.utils'
import { getBusinsesses } from '../business.controller'
import businessDir from '../directory.schema'

export default async function (fastify: FastifyInstance) {
  fastify
    .get('/test', testRoute)
    .get('/', { schema: getSchema(businessDir.get, 'many') }, getBusinsesses)
    .get('/:id', { schema: getSchema(businessDir.get, 'one') }, getBusinsesses)
}
