import sequelize from '../../../config/sequelize.config'
import { CreationOptional, STRING } from 'sequelize'

export interface IIndustry {
  name: string
  description: string

  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Industry = sequelize.define(
  'industry',
  {
    name: { type: STRING, allowNull: false, unique: true },
    description: { type: STRING, allowNull: true },
  },
  { timestamps: true }
)

export default Industry
