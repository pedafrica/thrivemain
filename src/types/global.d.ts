// // import fastifySwagger from '@fastify/swagger'

import { SignOptions } from "@fastify/jwt";

import { IRole } from "app/users/models/role.model";
import { IUser } from "app/users/models/user.model";
import { TSendMail } from "plugins/mailer.plugin";
import { RouteHandlerMethod } from "fastify";
import { Model, ModelDefined } from "sequelize";
import { ITransaction } from "app/users/models/transaction.model";
import { IBusiness } from "app/users/models/business.model";
import { IAddon } from "app/addons/model";
import { ISub } from "app/users/models/subscription.model";
import { Field } from "fastify-multer/lib/interfaces";
import { IVOffice } from "modules/virtual-office/models/virtualOffice.model";
import { INGO } from "../app/users/models/ngo.model";
import { IIndustry } from "../app/users/models/industry.model";
import { IProduct } from "../app/users/models/product.model";

// import {
//   FastifyRouteSchemaDef,
//   FastifySchemaControllerOptions,
// } from 'fastify/types/schema'

// // import { RouteHandlerMethod } from 'fastify'
// export {}

declare module "fastify" {
  interface FastifyInstance {
    generateToken: (e: any) => void;
    authenticate: RouteHandlerMethod;
    requireTransaction: RouteHandlerMethod;
    isAdmin: RouteHandlerMethod;
    acceptSingleFile: (name: string, path: string) => RouteHandlerMethod;
    acceptManyFile: (fields: Field[], path: string) => RouteHandlerMethod;
    processFiles: RouteHandlerMethod;
  }
  interface FastifyRequest {
    generateToken: (e: any, opts?: Partial<SignOptions>) => string;
    decodeToken: (e: string) => any;
    userModel: Model<IUser, {}> | null;
    userInclude: [];

    initializeTransaction: (
      amount: number,
      // split_code?: string,
      plan?: string
    ) => Promise<{
      authorization_url: string;
      reference: string;
    }>;

    verifyTransaction: (reference: string) => Promise<{
      status: boolean;
      message: "string";
      data: {
        data: {
          id: number;
          status: string;
          reference: string;
          amount: number;
        };
      };
    }>;

    models: {
      User: ModelDefined<IUser, {}>;
      Addon: ModelDefined<IAddon, {}>;
      Role: ModelDefined<IRole, {}>;
      Transaction: ModelDefined<ITransaction, {}>;
      Business: ModelDefined<IBusiness, {}>;
      Subscription: ModelDefined<ISub, {}>;
      VirtualOffice: ModelDefined<IVOffice, {}>;
      Ngo: ModelDefined<INGO, {}>;
      Industry: ModelDefined<IIndustry, {}>;
      Product: ModelDefined<IProduct, {}>;
    };
    // authenticate: RouteHandlerMethod
  }
  interface FastifyReply {
    sendMail: (messageData: TSendMail) => Promise<string>;
    sendTestMail: (messageData: TSendMail) => Promise<string>;
    // authenticate: RouteHandlerMethod
  }
  // interface FastifyRequest {
  //   token: string
  // }
  // interface FastifySchema extends FastifySchemaControllerOptions {}
}
