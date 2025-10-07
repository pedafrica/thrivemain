import { FastifyInstance } from "fastify";
import {
  forgotPass,
  requestVerificationlWithCode,
  resetPass,
  userLogin,
  userSignup,
  verificationlWithCode,
  verifyemail,
} from "../controllers/auth.controller";
import { getSchema, getSchema as gs } from "../../../utils/schema.utils";
import { authSchema } from "../schemas/auth.schema";
import { testRoute } from "../../../utils/index.util";
import { subSchema } from "../schemas/subscription.schema";
import { paymentWebhook } from "../controllers/subscription.controller";

export default async function (fastify: FastifyInstance) {
  const {
    createBody,
    login,
    forgotPass: fp,
    resetPass: rtPass,
    verifyEmail: vEmail,
    requestEmailCodeRes,
    confirmEmailCodeRes,
    loginRes,
    changePass,
  } = authSchema;
  fastify
    .get("/test", testRoute)

    /* ------------------------- Auth Routes ------------------------- */
    .post(
      "/signup",
      { schema: gs(loginRes, "one", { body: createBody }) },
      userSignup
    )
    .post("/login", { schema: gs(loginRes, "one", { body: login }) }, userLogin)
    .post(
      "/forgot-password",
      { schema: gs("2xx", "one", { body: fp }) },
      forgotPass
    )
    .post(
      "/verify-email",
      { schema: gs("authSuccess", "one", { body: vEmail }) },
      verifyemail
    )
    .post(
      "/request-verify-email-code",
      // { schema: gs(requestEmailCodeRes, 'one', { body: fp }) },
      requestVerificationlWithCode
    )
    .post(
      "/verify-email-code",
      { schema: gs(confirmEmailCodeRes, "one", { body: vEmail }) },
      verificationlWithCode
    )
    .put(
      "/reset-password",
      {
        // @ts-ignore
        schema: gs("2xx", "one", { body: rtPass }),
      },
      resetPass
    )
    .put(
      "/change-password",
      {
        // @ts-ignore
        preHandler: fastify.authenticate,
        schema: gs("2xx", "one", { body: changePass }),
      },
      resetPass
    )
    .post(
      "/webhook",
      { schema: getSchema("2xx", "one", { body: subSchema.webhook }) },
      paymentWebhook
    );
}
