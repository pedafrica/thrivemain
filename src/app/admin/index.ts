import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance } from 'fastify'
import path from 'path'

export default async function (fastify: FastifyInstance) {
  // await fastify.register(fastifyAutoload, {
  //   dir: path.join(__dirname, 'plugins'),
  // })

  // @ts-ignore
  // fastify.addHook('onRequest', fastify.authenticate)
  // // @ts-ignore
  // fastify.addHook('onRequest', fastify.isAdmin)
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
  })
}
