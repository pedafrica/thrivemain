import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING } from 'sequelize'
import { healthSchema } from '../health.schema'
import cloudinary from '../../../config/cloudinary'

export interface IHealth extends Static<typeof healthSchema.createInstitution> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const HealthInstitution: ModelDefined<IHealth, {}> = sequelize.define(
  'healthInstitution',
  {
    name: { type: STRING, allowNull: false, unique: true },
    email: { type: STRING, allowNull: false },
    phone: { type: STRING, allowNull: false },
    logo: { type: STRING, allowNull: true },
    url: { type: STRING, allowNull: true },
    bio: { type: STRING, allowNull: true },
    cover: {
      type: STRING,
      allowNull: true,
      get() {
        const { cover } = this.dataValues
        return cloudinary.url(cover || `health${~~(Math.random() * 6) + 1}`)
      },
    },
  }
)

export default HealthInstitution
