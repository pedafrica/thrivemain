import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { templateSchema } from '../template.schema'

export interface ITemplateCategory
  extends Static<typeof templateSchema.createCategory> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Category: ModelDefined<ITemplateCategory, {}> = sequelize.define(
  'templateCategory',
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: true },
  }
)

export default Category
