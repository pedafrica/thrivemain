import { FastifyInstance } from 'fastify'
import { getSchema } from '../../../utils/schema.utils'
import { getUser, updateProfile } from '../controllers/user.controller'
import { userSchema } from '../schemas/user.schema'
import { addonBody } from '../../../app/addons/addon.schema'
import { getAddons } from '../controllers/subscription.controller'
import { membersCount } from '../../admin/controllers/users.controller'

export default async (fastify: FastifyInstance) => {
  fastify
    // @ts-ignore
    .addHook('preHandler', fastify.authenticate)
    .get(
      '/',
      {
        schema: getSchema(userSchema.get, 'one', {
          desc: 'Returns authenticated user',
        }),
      },
      getUser
    )
    .put(
      '/',
      {
        // schema: getSchema('2xx', 'one', {
        //   desc: 'User update schema',
        //   body: userSchema.update,
        // }),
      },
      updateProfile
    )
    .get(
      '/addons',
      {
        schema: getSchema(addonBody.get, 'many', {
          desc: 'Returns all subscribed addons',
        }),
      },
      getAddons
    )
}
