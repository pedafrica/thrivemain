import { FastifyInstance } from 'fastify'
import { getRecords, testRoute } from '../../../utils/index.util'
import { getSchema } from '../../../utils/schema.utils'
import { doCreateNgo } from '../controllers/user.controller'
import { userSchema } from '../schemas/user.schema'

export default async function (fastify: FastifyInstance) {
  fastify
    .get('/ngo/test', testRoute)

    // Application Routes
    .get(
      '/ngos',
      {
        schema: getSchema(userSchema.getCats, 'many', {
          desc: "Returns all NGO's",
          pahinate: false,
        }),
      },

      (req) => getRecords(req, 'Ngo', { paginate: false })
    )
    .post(
      '/ngos',
      {
        schema: getSchema('2xx', 'one', { body: userSchema.createCategory }),
      },
      doCreateNgo
    )
}
