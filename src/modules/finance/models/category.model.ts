import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { financeSchema } from '../finance.schema'

export interface IFinanceCategory
  extends Static<typeof financeSchema.createCategory> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Category: ModelDefined<IFinanceCategory, {}> = sequelize.define(
  'financeCategory',
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: true },
  }
)

export default Category
