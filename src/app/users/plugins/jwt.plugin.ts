import { SignOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { User } from "../models";
import { IRole } from "../models/role.model";
import { col } from "sequelize";

export default fp(async function (fastify) {
  fastify.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET || "",
  });

  fastify.decorateRequest("userModel", null);

  // fastify.addHook('onRequest', (req) => req.setToken('token'))

  fastify.decorateRequest(
    "generateToken",
    (payload: any, opts?: Partial<SignOptions>) =>
      fastify.jwt.sign(payload, opts)
  );

  fastify.decorateRequest("decodeToken", (token: string) =>
    fastify.jwt.decode(token)
  );

  fastify.decorate(
    "isAdmin",
    async (req: FastifyRequest, rep: FastifyReply) => {
      // @ts-ignore
      const role: IRole = await req.userModel!.getRole();
      return role.name == "admin";
    }
  );

  fastify.decorate(
    "isActivated",
    async (req: FastifyRequest, rep: FastifyReply) =>
      // @ts-ignore
      req.userModel!.dataValues.accountVerifiedAt != null
  );

  fastify.decorate(
    "isVerified",
    async (req: FastifyRequest, rep: FastifyReply) =>
      // @ts-ignore
      req.userModel!.dataValues.emailVerifiedAt != null
  );

  // fastify
  // @ts-ignore
  fastify.decorateRequest("userInclude", function () {
    return [
      {
        // @ts-ignore
        model: this.models.Business,

        // @ts-ignore
        include: [this.models.Industry, this.models.Product],
      },
      {
        // @ts-ignore
        model: this.models.Role,
        // attributes: [],
      },
      {
        // @ts-ignore
        model: this.models.Ngo,
        // attributes: [],
      },
      {
        // @ts-ignore
        model: this.models.Subscription,
        as: "premuimSub",
      },
      {
        // @ts-ignore
        model: this.models.Subscription,
        as: "platinumSub",
      },

      // @ts-ignore
      this.models.VirtualOffice,
    ];
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();

        // @ts-ignore
        request.userModel = await User.findOne({
          // @ts-expect-error
          where: { email: request.user.email },
          // @ts-ignore
          include: request.userInclude(),
        });
      } catch (err) {
        reply.send(err);
      }
    }
  );
});
