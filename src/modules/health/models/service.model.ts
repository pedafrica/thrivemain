import { Static } from '@sinclair/typebox'
import {
  BOOLEAN,
  CreationOptional,
  INTEGER,
  ModelDefined,
  STRING,
  TEXT,
} from 'sequelize'
import cloudinary from '../../../config/cloudinary'
import sequelize from '../../../config/sequelize.config'
import { healthSchema } from '../health.schema'

export interface IHealthService extends Static<typeof healthSchema.create> {
  id: number
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const HealthService: ModelDefined<IHealthService, {}> = sequelize.define(
  'healthService',
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: { type: STRING, allowNull: false },
    isPlatinum: { type: BOOLEAN, defaultValue: false },
    url: { type: STRING, allowNull: true },
    cover: {
      type: STRING,
      allowNull: true,
      get() {
        const { cover } = this.dataValues
        return cloudinary.url(cover || `health${~~(Math.random() * 6) + 1}`)
      },
    },
    description: { type: TEXT, allowNull: true },
  }
)

export default HealthService
