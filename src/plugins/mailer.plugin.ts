import dotenv from "dotenv";
import fp from "fastify-plugin";
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from "nodemailer";

dotenv.config();

export type TSendMail = {
  subject: string;
  from?: string;
  to: string;
  body: string;
};

export default fp(async function (fastify) {
  fastify.decorateReply(
    "sendMail",
    // @ts-ignore
    async function ({
      from = process.env.EMAIL_USER,
      to,
      body,
      subject,
    }: TSendMail) {
      try {
        // create reusable transporter object using the default SMTP transport
        // host/port/secure are env-driven so the SMTP provider can be swapped
        // (e.g. during DNS propagation) via env vars only, no code change needed.
        const transporter = createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || "587"),
          secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports (e.g. 587 STARTTLS)
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from, // sender address
          to, // list of receivers
          subject, // Subject line
          // text: 'Hello world?', // plain text body
          html: body, // html body
        });

        console.log("Message sent: %s", info);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      } catch (error) {
        console.error(
          `Erorr sending mail to ${to}`,
          error instanceof Error ? error.message : error
        );
        // Re-throw so callers (and Fastify's default error handler) can see
        // the failure instead of a silent false-success response.
        throw error;
      }
    }
  );

  fastify.decorateReply(
    "sendTestMail",
    // @ts-ignore
    async function main({
      from = process.env.EMAIL_USER,
      to,
      body,
      subject,
    }: TSendMail) {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = createTransport({
        host: "mail.privateemail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      // send mail with defined transport object
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from, // sender address
        to, // list of receivers
        subject, // Subject line
        // text: 'Hello world?', // plain text body
        html: body, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  );
});
