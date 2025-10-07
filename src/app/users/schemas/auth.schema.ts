import { Type } from '@sinclair/typebox'
import { userSchema } from './user.schema'

export const authSchema = {
  createBody: Type.Object({
    firstName: Type.String({ minLength: 1 }),
    lastName: Type.String({ minLength: 1 }),
    email: Type.String({ format: 'email' }),
    phone: Type.String({ minLength: 10 }),
    password: Type.String(),
    username: Type.Optional(Type.RegEx(/^(?=.*[A-Za-z0-9]).{3,30}$/)),
    emailVerifiedToken: Type.String(),
  }),
  login: Type.Object({
    password: Type.String(),
    email: Type.String({ format: 'email' }),
  }),
  loginRes: Type.Object({
    accessToken: Type.String(),
    user: userSchema.get,
  }),
  forgotPass: Type.Object({
    email: Type.String({ format: 'email' }),
    requestType: Type.Optional(Type.String()),
  }),
  resetPass: Type.Object({
    password: Type.String({ minLength: 6 }),
    confirmPassword: Type.String({ minLength: 6 }),
    emailVerifiedToken: Type.String(),
  }),
  changePass: Type.Object({
    password: Type.String({ minLength: 6 }),
    confirmPassword: Type.String({ minLength: 6 }),
    oldPassword: Type.String({ minLength: 6 }),
  }),
  verifyEmail: Type.Object({
    email: Type.String({ format: 'email' }),
    verifyToken: Type.String(),
    code: Type.Optional(Type.Number()),
  }),
  confirmEmailCodeRes: Type.Object({
    emailVerifiedToken: Type.String(),
  }),
  requestEmailCodeRes: Type.Object({
    verifyToken: Type.String(),
  }),
}
