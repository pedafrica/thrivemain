"use strict";

import baseSchema from "./constants/schema.contant";
import AutoLoad from "@fastify/autoload";
import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRegisterOptions,
} from "fastify";
import fp from "fastify-plugin";
import path from "path";
import { setSchema, success, testRoute } from "./utils/index.util";
import { sequelize } from "./config";
import { membersCount } from "./app/admin/controllers/users.controller";
import { Static, Type } from "@sinclair/typebox";
import { constactSchema, getSchema } from "./utils/schema.utils";

export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "app"),
    maxDepth: 1,
  });
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "modules"),
    maxDepth: 1,
  });

  fastify.register(
    fp(
      (
        fastify: FastifyInstance,
        opts: FastifyRegisterOptions<{}>,
        done: VoidFunction
      ) => {
        fastify
          .get("/", async (req, rep) => {
            return { message: "Thrive Api works just fine" };
          })
          .get("/sync__", async (req, rep) => {
            await sequelize.sync({ force: true });
            return { message: "Completed Database Sync" };
          })
          .get("/members/count", membersCount)
          .post(
            "/guest/send",
            {
              schema: getSchema("2xx", "one", { body: constactSchema }),
            },
            async (req, rep) => {
              const { email, name, subject, message } = req.body as Static<
                typeof constactSchema
              >;

              await rep.sendMail({
                body: `Hello <br/><br/> ---------- New Message From Contact Page ----------
                 <br/><br/>
                 Name:  ${name}
                 <br/>
                 Email:  ${email}
                 <br/>
                 Subject:  ${subject}
                 <br/>
                 Message:  ${message}
                 <br/>
                 <br/><br/>
                Regards,<br/>
                Thrive Team `,
                to: "frontoffice@thrivebiz.ng",
                subject: "New Contact Message",
              });

              return success("Message sent!");
            }
          );
        // .get('/', async (req, rep) => {
        //   await sequelize.sync({ force: true })
        // })
        done();
      }
    )
  );

  for (let i = 0; i < baseSchema.length; i++) fastify.addSchema(baseSchema[i]);
}
