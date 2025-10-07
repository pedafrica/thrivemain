import sequelize from '../../../config/sequelize.config'
import { CreationOptional, ModelDefined, STRING } from 'sequelize'
import { eventSchema } from '../event.schema'
import { Static } from '@sinclair/typebox'

export interface IEventOrganizer
  extends Static<typeof eventSchema.createOrganizer> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const EventOrganizer: ModelDefined<IEventOrganizer, {}> = sequelize.define(
  'eventOrganizer',
  {
    name: { type: STRING, allowNull: false, unique: true },
    website: { type: STRING, allowNull: true },
    bio: { type: STRING, allowNull: true },
  }
)

export default EventOrganizer
