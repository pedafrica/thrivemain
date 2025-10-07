import sequelize from '../../../config/sequelize.config'
import { CreationOptional, STRING } from 'sequelize'

export interface IRole {
  name: string
  description: string

  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Role = sequelize.define(
  'role',
  {
    name: { type: STRING, allowNull: false, unique: true },
    description: { type: STRING, allowNull: false },
  },
  { timestamps: true }
)

export default Role
