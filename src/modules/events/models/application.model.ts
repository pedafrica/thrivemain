import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined } from 'sequelize'
import { eventSchema } from '../event.schema'

export interface IEventApplication
  extends Static<typeof eventSchema.createApplication> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Application: ModelDefined<IEventApplication, {}> =
  // @ts-ignore
  sequelize.define('eventApplication', {})

export default Application
