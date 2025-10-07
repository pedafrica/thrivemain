import { CreationOptional } from 'sequelize'

export type creationOptional = {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}
