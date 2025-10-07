import { FastifyInstance } from "fastify";
import { adminUsersSchema } from "../../schemas/user.schema";
import { testRoute } from "../../../../utils/index.util";
import {
  adminGetUser,
  approveUser,
  declineUser,
  getApprovedUsers,
  getUserBusinsess,
  getUsers,
  getUsersPendingApproval,
  suspendUser,
} from "../../../../app/admin/controllers/users.controller";
import { getSchema } from "../../../../utils/schema.utils";
import { adminBusinessSchema } from "../../../../app/admin/schemas/business.schems";

export default async function (fastify: FastifyInstance) {
  const { getRes } = adminUsersSchema,
    { getRes: gbRes } = adminBusinessSchema;

  fastify
    /*------------------------------------------------------*/
    // User Get Requests
    /*------------------------------------------------------*/
    .get("/test", testRoute)
    .get("/", { schema: getSchema(getRes, "many") }, getUsers)
    .get("/approved", { schema: getSchema(getRes, "many") }, getApprovedUsers)
    .get(
      "/pending-approval",
      {
        schema: getSchema(getRes, "many", {
          desc: "Returns all users that are awaiting approval",
        }),
      },
      getUsersPendingApproval
    )
    .get("/:id", { schema: getSchema(getRes, "one") }, adminGetUser)
    .get(
      "/:userId/business",
      { schema: getSchema(gbRes, "one") },
      getUserBusinsess
    )

    /*------------------------------------------------------*/
    // User Update Requests
    /*------------------------------------------------------*/

    .patch(
      "/approve/:id",
      {
        schema: getSchema(null, "one"),
      },
      approveUser
    )

    .patch(
      "/decline/:id",
      {
        schema: getSchema(null, "one"),
      },
      declineUser
    )

    .patch(
      "/suspend/:id",
      {
        schema: getSchema(null, "one"),
      },
      suspendUser
    );
  // .patch('/deactivate/:id', { schema: getSchema(null, 'one') }, approveUser)
}
