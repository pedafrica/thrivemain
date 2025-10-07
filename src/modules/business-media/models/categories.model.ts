import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { mediaSchema } from '../media.schema'

export interface IEventCategory
  extends Static<typeof mediaSchema.createCategory> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Category: ModelDefined<IEventCategory, {}> = sequelize.define(
  'mediaCategory',
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: true },
  }
)

export default Category
