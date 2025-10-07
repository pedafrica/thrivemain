import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { healthSchema } from '../health.schema'

export interface IHealthApplication
  extends Static<typeof healthSchema.createApplication> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Application: ModelDefined<IHealthApplication, {}> =
  // @ts-ignore
  sequelize.define('healthApplication', {})

export default Application
