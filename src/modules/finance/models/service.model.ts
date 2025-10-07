import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import {
  BOOLEAN,
  CreationOptional,
  ModelDefined,
  STRING,
  TEXT,
} from 'sequelize'
import { financeSchema } from '../finance.schema'
import cloudinary from '../../../config/cloudinary'

export interface IFinanceService extends Static<typeof financeSchema.create> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const FinacialService: ModelDefined<IFinanceService, {}> = sequelize.define(
  'financialService',
  {
    name: { type: STRING, allowNull: false },
    isPlatinum: { type: BOOLEAN, defaultValue: false },
    url: { type: STRING, allowNull: true },
    cover: {
      type: STRING,
      allowNull: true,
      get() {
        const { cover } = this.dataValues
        return cloudinary.url(cover || `finance${~~(Math.random() * 3) + 1}`)
      },
    },
    description: { type: TEXT, allowNull: false },
  }
)

export default FinacialService
