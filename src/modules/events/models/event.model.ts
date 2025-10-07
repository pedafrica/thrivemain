import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import {
  CreationOptional,
  ModelDefined,
  TEXT,
  STRING,
  DATE,
  NUMBER,
  INTEGER,
  ENUM,
  BOOLEAN,
} from 'sequelize'
import { eventSchema } from '../event.schema'
import cloudinary from '../../../config/cloudinary'

export interface IEvent extends Static<typeof eventSchema.create> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Event: ModelDefined<IEvent, {}> = sequelize.define(
  'event',
  {
    name: { type: STRING, allowNull: false },
    amount: { type: INTEGER, allowNull: false },
    discout: { type: INTEGER, defaultValue: 0 },
    discountType: { type: ENUM('percent', 'fixed'), allowNull: true },
    isPlatinum: { type: BOOLEAN, defaultValue: false },
    url: { type: STRING, allowNull: true },
    cover: {
      type: STRING,
      allowNull: true,
      get() {
        const { cover } = this.dataValues
        return cloudinary.url(cover || `event${~~(Math.random() * 5) + 1}`)
      },
    },
    startDate: { type: DATE, allowNull: false },
    endDate: { type: DATE, allowNull: false },
    description: { type: TEXT, allowNull: false },
    location: { type: STRING, allowNull: false },
  },
  {
    hooks: {
      afterFind(evnt) {},
    },
  }
)

export default Event
