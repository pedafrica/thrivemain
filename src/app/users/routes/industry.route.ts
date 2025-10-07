import { FastifyInstance } from 'fastify'
import { getRecords, testRoute } from '../../../utils/index.util'
import { getSchema } from '../../../utils/schema.utils'
import { doCreateIndustry } from '../controllers/user.controller'
import { userSchema } from '../schemas/user.schema'

export default async function (fastify: FastifyInstance) {
  fastify
    .get('/industries/test', testRoute)

    // Application Routes
    .get(
      '/industries',
      {
        schema: getSchema(userSchema.getCats, 'many', {
          desc: 'Returns all Industries',
          pahinate: false,
        }),
      },

      (req) => getRecords(req, 'Industry', { paginate: false })
    )
    .post(
      '/industries',
      {
        schema: getSchema('2xx', 'one', { body: userSchema.createCategory }),
      },
      doCreateIndustry
    )
}
