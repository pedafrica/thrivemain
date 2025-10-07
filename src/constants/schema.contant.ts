import { Type } from '@sinclair/typebox'
import { setSchema } from '../utils/index.util'

const baseSchema = [
  {
    $id: '4xx',
    type: 'object',
    properties: {
      statusCode: { type: 'number' },
      code: { type: 'string' },
      error: { type: 'string' },
      message: { type: 'string' },
    },
  },
  {
    $id: '2xx',
    type: 'object',
    properties: {
      code: { type: 'number' },
      success: { type: 'boolean' },
      message: { type: 'string' },
    },
  },
  {
    $id: 'authSuccess',
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
    },
  },
  {
    $id: 'header',
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
      },
    },
  },
  // {
  //   $id: 'file',
  //   type: 'object',
  //   properties: {
  //     encoding: { type: 'string' },
  //     filename: { type: 'string' },
  //     limit: { type: 'boolean' },
  //     mimetype: { type: 'string' },
  //   },
  // },
] as const

export const getOneWithAuthSchema = setSchema({
    params: Type.Object({
      id: Type.Number(),
    }),
    withAuth: true,
  }),
  getAllWithAuthSchema = setSchema({
    params: Type.Object({
      page: Type.Number(),
      size: Type.Number(),
    }),
    withAuth: true,
  })

export default baseSchema
