import fastifyAutoload from '@fastify/autoload'
import { FastifyInstance } from 'fastify'
import path from 'path'

export default async function (fastify: FastifyInstance) {
  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
  })
}
