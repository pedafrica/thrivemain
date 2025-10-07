import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { financeSchema } from '../finance.schema'

export interface IFinanceApplication
  extends Static<typeof financeSchema.createApplication> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Application: ModelDefined<IFinanceApplication, {}> =
  // @ts-ignore
  sequelize.define('financeApplication', {})

export default Application
