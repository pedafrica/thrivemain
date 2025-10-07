import axios from "axios";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { config } from "dotenv";

config();

export default fp(async (fastify) => {
  fastify.decorateRequest(
    "initializeTransaction",
    // @ts-ignore
    async function (amount: number, plan?: string) {
      // @ts-ignore
      const email = this.user.email,
        txnData = {
          amount: amount * 100,
          email,
          callback_url: `${process.env.CLIENT_BASE_URL}/paystack`,
          // split_code,
          plan,
        };

      // if (split_code) txnData.split_code = split_code;

      try {
        const txn: any = await axios.post(
          "https://api.paystack.co/transaction/initialize",
          txnData,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
              "Content-Type": "application/json",
            },
          }
        );

        const {
          data: { authorizationUrl, reference },
        } = txn.data;

        return {
          authorizationUrl: authorizationUrl,
          reference,
        };
      } catch (error) {
        // @ts-ignore
        console.log(error.response || error.message || error);

        throw new Error("Transaction Initialisation failed");
      }
    }
  );
  fastify.decorateRequest(
    "verifyTransaction",
    async function (reference: string) {
      try {
        return await axios.get(
          `https://api.paystack.co/transaction/verify/${reference}`,

          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        // console.log(error)
        // console.log(reference)

        // @ts-ignore
        throw new Error(error?.message || error);
      }
    }
  );

  fastify.decorate(
    "requireTransaction",
    async (req: FastifyRequest, rep: FastifyReply) => {
      // @ts-expect-error
      if (!req.body || !req.body.txnId)
        throw rep.unprocessableEntity("You have to initiate a transaction");
      // const txn = await Transaction.findByPk(txnId)
      // if (!txn) throw rep.badRequest('Invalid transaction ID')
    }
  );
});
