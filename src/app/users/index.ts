import fastifyAutoload from '@fastify/autoload'
import fp from 'fastify-plugin'
import path from 'path'

export default fp(async function (fastify) {
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'plugins'),
  })
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: '/users' },
  })
})
