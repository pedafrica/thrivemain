import fp from 'fastify-plugin'
import {
  Business,
  Ngo,
  Role,
  Subscription,
  Transaction,
  User,
  VirtualOffice,
  Industry,
  Product,
} from '../models'
import Addon from '../../../app/addons/model'

export default fp(async function (fastify) {
  fastify.addHook('preHandler', (req, rep, done) => {
    // @ts-ignore
    req.models = {
      // @ts-ignore
      ...req.models,
      User,
      Ngo,
      Role,
      Transaction,
      Business,
      Subscription,
      Addon,
      Industry,
      VirtualOffice,
      Product,
    }

    done()
  })
})
