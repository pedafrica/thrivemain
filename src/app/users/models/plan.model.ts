import sequelize from '../../../config/sequelize.config'
import { CreationOptional, ModelDefined, STRING } from 'sequelize'

export interface IPlan {
  name: string
  description: string
  code: string

  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Plan: ModelDefined<IPlan, {}> = sequelize.define('plan', {
  name: { type: STRING, allowNull: false, unique: true },
  code: { type: STRING, allowNull: false, unique: true },
  description: { type: STRING, allowNull: true },
})

export default Plan
