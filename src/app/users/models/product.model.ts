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
import cloudinary from '../../../config/cloudinary'

export interface IProduct {
  images: string
  amount: number
  description: string
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Product: ModelDefined<IProduct, {}> = sequelize.define('product', {
  name: { type: STRING, allowNull: false },
  amount: { type: INTEGER, allowNull: false },
  images: {
    type: TEXT,
    allowNull: true,

    set(val: []) {
      this.setDataValue('images', val.join('|'))
    },
    get() {
      const { images } = this.dataValues

      return images
        .split('|')
        .map((_) => cloudinary.url(_ || `product${~~(Math.random() * 5) + 1}`))
    },
  },
  description: { type: TEXT, allowNull: false },
})

export default Product
