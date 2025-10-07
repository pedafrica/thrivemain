import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { getSchema } from '../../../utils/schema.utils'
import {
  createBusiness,
  getBusiness,
  updateBusiness,
} from '../controllers/business.controller'
import { businessSchema } from '../schemas/business.schema'

export default async function (fastify: FastifyInstance) {
  fastify
    // @ts-ignore
    .addHook('preHandler', fastify.authenticate)
    .get(
      '/business/:slug',
      {
        schema: getSchema(businessSchema.get, 'one', {
          withAuth: true,
          consumes: ['multipart/form-data'],
          params: Type.Object({ slug: Type.String() }),
        }),
      },
      getBusiness
    )
    .get('/business', getBusiness)
    .post(
      '/business',
      {
        preHandler: [
          // // @ts-ignore
          // fastify.acceptManyFile(
          //   [
          //     { name: 'logo', maxCount: 1 },
          //     { name: 'cac', maxCount: 1 },
          //   ],
          //   '/business'
          // ),
        ],
        schema: getSchema('2xx', 'one', {
          // body: businessSchema.create,
          withAuth: true,
          consumes: ['multipart/form-data'],
        }),
      },
      createBusiness
    )
    .put(
      '/business',
      {
        schema: getSchema('2xx', 'one', {
          body: businessSchema.update,
          withAuth: true,
        }),
      },
      updateBusiness
    )
}
