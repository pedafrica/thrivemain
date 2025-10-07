import { Static } from "@sinclair/typebox";
import { compare } from "bcryptjs";
import { RouteHandlerMethod } from "fastify";
import { Op } from "sequelize";
import { dateTimeNow } from "../../../utils/index.util";
import { authSchema } from "../schemas/auth.schema";

export const userSignup: RouteHandlerMethod = async (req, rep) => {
  let { email, username, emailVerifiedToken, ...rest } = req.body as Static<
    typeof authSchema.createBody
  >;
  // @ts-ignore
  const decoded = req.decodeToken(emailVerifiedToken);

  if (!decoded || !decoded.isVerified)
    rep.badRequest("Email has to be verified before proceeding");

  if (!username) username = email;

  // @ts-ignore
  let [user, created] = await req.models.User.findOrCreate({
    where: { [Op.or]: { username, email } },
    defaults: { username, email, roleId: 1, ...rest },
  });

  //@ts-ignore
  if (!created) throw rep.conflict("User already exists");

  const {
    password: pa,
    tokens,
    ..._rest
    // @ts-ignore
  } = (await user.reload({ include: req.userInclude() })).dataValues;

  //@ts-ignore
  rep.sendMail({
    body: `Hello ${rest.firstName} <br/><br/> Welcome to Thrive, kindly exercise patience while we verify your status. <br/><br/>
    Regards,<br/>
    Thrive Team `,
    to: email,
    subject: "Welcome To Thrive",
  });

  console.log("======================");

  // @ts-ignore
  return { accessToken: req.generateToken(_rest), user };
};

export const userLogin: RouteHandlerMethod = async (req, rep) => {
  const { email, password } = req.body as Static<typeof authSchema.login>,
    // @ts-ignore
    user = await req.models.User.findOne({
      where: { [Op.or]: { email } },
      // @ts-ignore
      include: req.userInclude(),
    });

  if (!user || !(await compare(password, user.dataValues.password)))
    throw rep.notFound("Invalid credentials");

  const { password: pa, tokens, ...rest } = user.dataValues;

  // @ts-ignore
  return { accessToken: req.generateToken(rest), user };
};

export const forgotPass: RouteHandlerMethod = async (req, rep) => {
  const { email } = req.body as Static<typeof authSchema.forgotPass>,
    // @ts-ignore
    user = await req.models.User.findOne({
      where: { [Op.or]: { email: email.trim() } },
    });

  if (!user) throw rep.notFound("User not found");

  const { email: _email, username: uName } = user.dataValues;

  // @ts-ignore
  await rep.sendMail({
    to: email,
    subject: "Reset Password Request",
    body: `
      Hello ${uName}, <br/> <br/>
      You have requested to reset your password. <a href="${
        process.env.CLIENT_BASE_URL
        // @ts-ignore
      }/reset-password/${req.generateToken(
      {
        email,
        username: uName,
      },
      { expiresIn: process.env.VERIFY_TOKEN_LIFESPAN }
    )}">Click here</a> to proceed. <br/> <br/>
      If you did not initiate a password reset, kindly ingnore this mail by not taking any action. <br/> <br/>
      Regards, <br/>
      NASK Team
      `,
  });

  return {
    code: 200,
    success: true,
    message: "A reset link has been sent to your mail",
  };
};

export const requestVerificationlWithCode: RouteHandlerMethod = async (
  req,
  rep
) => {
  const { email, requestType } = req.body as Static<
    typeof authSchema.forgotPass
  >;
  if (
    requestType === "register" &&
    //@ts-ignore
    (await req.models.User.findOne({ where: { email } }))
  )
    //@ts-ignore
    throw rep.conflict("User already exists");

  const code = Math.floor(100000 + Math.random() * 900000);

  // @ts-ignore
  await rep.sendMail({
    to: email,
    subject: "Email Verification Request",
    body: `
      Hello ${email.split("@")[0]}, <br/><br/>
      Your email verification code is <string>${code}</strong>. . <br/> <br/>

      Regards, <br/>
      Thrive Team
      `,
  });
  console.log({ code });

  return {
    // @ts-ignore
    verifyToken: req.generateToken({ email, code }, { expiresIn: "5mins" }),
  };
};

export const verificationlWithCode: RouteHandlerMethod = async (req, rep) => {
  const { email, code, verifyToken } = req.body as Static<
    typeof authSchema.verifyEmail
  >;

  // @ts-ignore
  const decoded: any = req.decodeToken(verifyToken);

  if (!decoded || !(decoded.email === email && decoded.code === code))
    throw rep.badRequest("Invalid verification code");

  // @ts-ignore
  const emailVerifiedToken: string = req.generateToken({
    email,
    isVerified: true,
  });

  return { emailVerifiedToken };
};

export const verifyemail: RouteHandlerMethod = async (req, rep) => {
  const { email, verifyToken } = req.body as Static<
    typeof authSchema.verifyEmail
  >;

  // @ts-ignore
  let user = await req.models.User.findOne({ where: { email } });

  // @ts-ignore
  const decoded = req.decodeToken(verifyToken);
  if (!user || !decoded)
    throw rep.badRequest("Invalid request, user not found");

  // @ts-ignore
  user = await req.models.User.findOne({
    where: { [Op.and]: { username: decoded.username, email: decoded.email } },
  });

  if (!user) throw rep.notFound("Invalid request, user not found");

  await user.update({ emailVerifiedAt: dateTimeNow() });

  const { password: pa, tokens, ...rest } = user.dataValues;

  // @ts-ignore
  return { accessToken: req.generateToken(rest) };
};

export const resetPass: RouteHandlerMethod = async (req, rep) => {
  // @ts-ignore
  const { password, confirmPassword, emailVerifiedToken, oldPassword } =
    req.body as Static<typeof authSchema.resetPass>;
  let decoded;
  if (oldPassword) {
    // @ts-ignore
    if (!(await compare(oldPassword, req.userModel.dataValues.password)))
      // @ts-ignore
      throw rep.notFound("Invalid credentials");
    // @ts-ignore
    decoded = req.user;
  } else {
    // @ts-ignore
    decoded = req.decodeToken(emailVerifiedToken);
    if (!decoded || !decoded.isVerified)
      rep.badRequest("Email has to be verified before proceeding");
  }
  if (password !== confirmPassword)
    throw rep.badRequest("Password does not match, pls confirm and try again");

  // @ts-ignore
  const passwordUpdated = req.models.User.update(
    { password },
    { where: { email: decoded.email }, individualHooks: true }
  );

  if (!passwordUpdated)
    throw rep.expectationFailed("Failed to updated password, try again");

  //@ts-ignore
  rep.sendMail({
    body: `Hello <br/><br/> Your password has been successfully updated. You can now login with your new password<br/><br/>
    Regards,<br/>
    Thrive Team `,
    to: decoded.email,
    subject: "Password Updated",
  });

  return {
    code: 200,
    success: true,
    message: "Your password has been successfully updated, proceed to login",
  };
};
