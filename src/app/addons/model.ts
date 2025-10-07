import sequelize from '../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import {
  CreationOptional,
  INTEGER,
  ModelDefined,
  NUMBER,
  STRING,
} from 'sequelize'
import { addonBody } from './addon.schema'

export interface IAddon extends Static<typeof addonBody.create> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Addon: ModelDefined<IAddon, {}> = sequelize.define(
  'addon',
  {
    name: { type: STRING, allowNull: false, unique: true },
    slug: { type: STRING, allowNull: false, unique: true },
    cover: { type: STRING, allowNull: false },
    price: { type: INTEGER },
    description: { type: STRING, allowNull: false },
  },
  { timestamps: true }
)

export default Addon
