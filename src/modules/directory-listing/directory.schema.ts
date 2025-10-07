import { Type } from '@sinclair/typebox'
import { businessSchema } from '../../app/users/schemas/business.schema'

const businessDir = {
  get: businessSchema.get,

  getParams: Type.Object({
    id: Type.Number(),
  }),
}

export default businessDir
