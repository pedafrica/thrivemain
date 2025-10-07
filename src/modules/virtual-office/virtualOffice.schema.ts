import { Type } from '@sinclair/typebox'

export const virtualOfficeSchema = {
  create: Type.Object({
    name: Type.String(),
    address: Type.String(),
    cac: Type.Optional(Type.String()),
    designation: Type.String(),
    taxId: Type.Optional(Type.String()),
    validId: Type.Optional(Type.String()),
  }),
  get: Type.Object({
    id: Type.Number(),
    name: Type.String(),
    address: Type.String(),
    cac: Type.String(),
    designation: Type.String(),
    taxId: Type.String(),
    validId: Type.String(),
    vAddress: Type.String(),
  }),
  approve: Type.Object({
    id: Type.Number(),
  }),
}
