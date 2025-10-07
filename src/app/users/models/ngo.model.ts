import sequelize from '../../../config/sequelize.config'
import { CreationOptional, STRING } from 'sequelize'

export interface INGO {
  name: string
  description: string

  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Ngo = sequelize.define(
  'ngo',
  {
    name: { type: STRING, allowNull: false, unique: true },
    description: { type: STRING, allowNull: true },
  },
  { timestamps: true }
)

export default Ngo
