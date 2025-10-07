import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { healthSchema } from '../health.schema'

export interface IHealthCategory
  extends Static<typeof healthSchema.createCategory> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Category: ModelDefined<IHealthCategory, {}> = sequelize.define(
  'healthCategory',
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: true },
  }
)

export default Category
