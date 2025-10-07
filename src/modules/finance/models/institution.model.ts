import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING } from 'sequelize'
import { financeSchema } from '../finance.schema'

export interface IInstitution
  extends Static<typeof financeSchema.createInstitution> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const FinancialInstitution: ModelDefined<IInstitution, {}> = sequelize.define(
  'financialInstitution',
  {
    name: { type: STRING, allowNull: false, unique: true },
    logo: { type: STRING, allowNull: true },
    url: { type: STRING, allowNull: true },
    bio: { type: STRING, allowNull: true },
  }
)

export default FinancialInstitution
