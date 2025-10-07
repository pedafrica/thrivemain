import { Static, Type } from '@sinclair/typebox'

export const user = {
    email: Type.String({ format: 'email' }),
    password: Type.String(),
    username: Type.String({ format: '^[A-Za-z][A-Za-z0-9_]{4,14}$' }),
  },
  UserCreate = Type.Object(user),
  UserRes = Type.Object({
    ...user,
    id: Type.Number(),
    token: Type.Array(Type.String()),
    emailVerified: Type.Boolean(),
    status: Type.String(),
  }),
  Profile = Type.Object({
    firstname: Type.String(),
    lastname: Type.String(),
  }),
  params = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'user ID',
      },
    },
  }

export type ProfileType = Static<typeof Profile>

const profileSchema = {
  response: {
    200: Profile,
  },
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
      },
    },
    required: ['Authorization'],
  },
  description: 'post some data',
}

export default profileSchema
