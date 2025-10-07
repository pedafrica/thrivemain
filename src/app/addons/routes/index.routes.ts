import { Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { setSchema } from '../../../utils/index.util'
import { createAddon, getAddon, getAddons } from '../addon.controller'
import { addonBody } from '../addon.schema'
import { getSchema } from '../../../utils/schema.utils'

export default async function (fastify: FastifyInstance) {
  fastify
    .get('/', { schema: getSchema(addonBody.get, 'many') }, getAddons)
    .post(
      '/',
      {
        schema: setSchema({
          withAuth: true,
          desc: 'Addons create schema',
          body: addonBody.create,
        }),
      },
      createAddon
    )
    .get('/:id', { schema: getSchema(addonBody.get, 'one') }, getAddon)
}
