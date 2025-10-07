import { FastifyInstance } from 'fastify'
import { testRoute } from '../../../utils/index.util'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', testRoute)
}
