import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import multer from 'fastify-multer'
import { Field } from 'fastify-multer/lib/interfaces'
import fp from 'fastify-plugin'

// async function onFile(part: MultipartFile) {
//   var source = part.file
//   var dest = createWriteStream(`/uploads/${part.fieldname}/${part.filename}`)
//   // you have access to original request via `this`
//   console.log(part.filename)
//   await pump(source, dest)
// }

export default fp(async (fastify) => {
  fastify.register(multer.contentParser)

  fastify
    .decorate('multer', (path: string) =>
      multer({
        storage: multer.diskStorage({
          destination: `./uploads/${path}`,
          filename: function (req, file, cb) {
            cb(
              null,
              `${file.fieldname}-${Date.now()}.${
                file.originalname.split('.')[1]
              }`
            )
          },
        }),
      })
    )

    // fastify
    //   .decorate('acceptSingleFile', (name: string) =>
    //     console.log(name)
    //   )
    .decorate(
      'acceptManyFile',
      // @ts-ignore
      (fields: Field[], path = '/random') =>
        (
          req: FastifyRequest,
          rep: FastifyReply,
          done: HookHandlerDoneFunction
        ) =>
          // @ts-ignore
          fastify.multer(path).fields(fields)(req, rep, done)
    )
    .decorate(
      'acceptSingle',
      (feild: string, path = '/random') =>
        // @ts-ignore
        (
          req: FastifyRequest,
          rep: FastifyReply,
          done: HookHandlerDoneFunction
        ) =>
          // @ts-ignore
          fastify.multer(path).single(feild)(req, rep, done)
    )
})
