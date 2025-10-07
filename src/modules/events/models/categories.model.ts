import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { eventSchema } from '../event.schema'

export interface IEventCategory
  extends Static<typeof eventSchema.createCategory> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Category: ModelDefined<IEventCategory, {}> = sequelize.define(
  'eventCategory',
  {
    name: { type: STRING, allowNull: false },
    description: { type: TEXT, allowNull: true },
  }
)

export default Category
