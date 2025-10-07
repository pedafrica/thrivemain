import fp from 'fastify-plugin'

export default fp(async (fastify, opts) => {
  await fastify
    .register(import('@fastify/swagger'), {
      // routePrefix: '/documentation',
      swagger: {
        info: {
          title: 'API Documentation',
          description: 'API Documentation for User Authentication',
          version: '1.0.0',
        },
        externalDocs: {
          url: 'https://swagger.io',
          description: 'Find more info here',
        },
        host: 'localhost',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    })
    .register(import('@fastify/swagger-ui'), {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next()
        },
        preHandler: function (request, reply, next) {
          next()
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject
      },
      transformSpecificationClone: true,
    })
})
