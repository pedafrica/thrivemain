import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import {
  BOOLEAN,
  CreationOptional,
  ModelDefined,
  STRING,
  TEXT,
} from 'sequelize'
import { templateSchema } from '../template.schema'
import cloudinary from '../../../config/cloudinary'

export interface ITemplate extends Static<typeof templateSchema.create> {
  id: CreationOptional<number>
  createdAt: CreationOptional<Date>
  updatedAt: CreationOptional<Date>
}

const Template: ModelDefined<ITemplate, {}> = sequelize.define('template', {
  name: { type: STRING, allowNull: false },
  isPlatinum: { type: BOOLEAN, defaultValue: false },
  mediaUrl: {
    type: STRING,
    allowNull: true,
    get() {
      const { mediaUrl, format } = this.dataValues
      return cloudinary
        .url(mediaUrl, {
          resource_type: ['jpg', 'png', 'webp', 'gif', 'pdf'].includes(format)
            ? 'image'
            : 'raw',
        })
        .replace('http:', 'https:')
    },
  },
  format: {
    // type: ENUM('pdf', 'webp', 'xls', 'docx', 'png', 'jpg', 'txt'),
    type: STRING(10),
    allowNull: false,
  },
  description: { type: TEXT, allowNull: false },
  metadata: {
    type: STRING,
    allowNull: false,
    get() {
      // @ts-ignore
      return JSON.parse(this.getDataValue('metadata'))
    },
    set(val) {
      //@ts-ignore
      this.setDataValue('metadata', JSON.stringify(val))
    },
  },
})

export default Template
