import fastify, { FastifyInstance } from 'fastify'
import { testRoute } from '../../../utils/index.util'
import { getSchema } from '../../../utils/schema.utils'
import { txnSchema } from '../schemas/transaction.schema'
import {
  createTransaction,
  getActiveTransaction,
  verifyTransaction,
} from '../controllers/transaction.controller'

export default async function (fastify: FastifyInstance) {
  // fastify.register(
  //   (r, rr, done) => {
  //     done()
  //   },
  //   { prefix: 'transaction' }
  // )
  fastify
    // @ts-ignore
    .addHook('preHandler', fastify.authenticate)
    .get('/transaction/test', testRoute)
    .post(
      '/transaction/:reference/verify',
      { schema: getSchema(txnSchema.get, 'one', { params: txnSchema.verify }) },
      verifyTransaction
    )
    .post(
      '/transaction/:type',
      {
        schema: getSchema(txnSchema.createRes, 'one', {
          body: txnSchema.create,
          params: txnSchema.createParam,
          withAuth: true,
        }),
      },
      createTransaction
    )
    .get(
      '/transaction/:type/:status',
      {
        schema: getSchema(txnSchema.createRes, 'one', {
          params: txnSchema.getParam,
          withAuth: true,
        }),
      },
      getActiveTransaction
    )
}
