import cloudinary from '../../../config/cloudinary'
import sequelize from '../../../config/sequelize.config'
import { Static } from '@sinclair/typebox'
import { CreationOptional, ModelDefined, STRING, TEXT } from 'sequelize'
import { businessSchema } from '../schemas/business.schema'

export interface IBusiness extends Static<typeof businessSchema.create> {
  id: CreationOptional<number>
  userId: CreationOptional<number>
}

const Business: ModelDefined<IBusiness, {}> = sequelize.define(
  'partnerProfile',
  {
    name: { type: STRING, allowNull: false, unique: true },
    email: { type: STRING, allowNull: false },
    phone: { type: STRING, allowNull: false },
    whatsappNumber: { type: STRING, allowNull: true },
    industry: { type: STRING, allowNull: false },
    bio: { type: TEXT, allowNull: false },
    address: { type: STRING, allowNull: true },
    cover: {
      type: STRING,
      allowNull: true,
      get() {
        const { cover } = this.dataValues
        return cloudinary.url(cover || 'cover', {
          width: 1200,
          height: 400,
        })
      },
    },
    logo: {
      type: STRING,
      allowNull: true,
      get() {
        const { logo } = this.dataValues

        return logo ? cloudinary.url(logo) : logo
      },
    },
    twitterLink: { type: STRING, allowNull: true },
    facebookLink: { type: STRING, allowNull: true },
    instagramLink: { type: STRING, allowNull: true },
    linkedinLink: { type: STRING, allowNull: true },
  }
)

export default Business
