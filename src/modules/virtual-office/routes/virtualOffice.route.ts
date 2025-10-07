import { FastifyInstance } from 'fastify'
import { getSchema } from '../../../utils/schema.utils'
import {
  createVirtualOffice,
  getVirtualOffice,
} from '../virtualOffice.controller'
import { virtualOfficeSchema } from '../virtualOffice.schema'
import { testRoute } from '../../../utils/index.util'

export default async function (fastify: FastifyInstance) {
  fastify
    // @ts-ignore
    .addHook('preHandler', fastify.authenticate)
    .get('/test', testRoute)
    .get(
      '/',
      { schema: getSchema(virtualOfficeSchema.get, null) },
      getVirtualOffice
    )
    .post(
      '/',
      {
        // preHandler: [
        //   // @ts-ignore
        //   fastify.acceptManyFile(
        //     [
        //       { name: 'validId', maxCount: 1 },
        //       { name: 'cac', maxCount: 1 },
        //     ],
        //     '/virtual-office'
        //   ),
        // ],

        schema: getSchema('2xx', 'one', {}),
      },
      createVirtualOffice
    )
}
