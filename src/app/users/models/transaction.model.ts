import sequelize from '../../../config/sequelize.config'
import {
  CreationOptional,
  ENUM,
  INTEGER,
  ModelDefined,
  STRING,
} from 'sequelize'

export interface ITransaction {
  amount: number
  status: string
  authorizationUrl: string
  reference?: string

  id: CreationOptional<number>
  userId: CreationOptional<number>
}

const Transaction: ModelDefined<ITransaction, {}> = sequelize.define(
  'transaction',
  {
    status: {
      type: ENUM('pending', 'success', 'failed'),
      allowNull: true,
      defaultValue: 'pending',
    },
    type: ENUM('premium', 'platinum'),
    amount: { type: INTEGER, allowNull: false },
    reference: { type: STRING, allowNull: false },
  },
  {
    indexes: [{ unique: true, fields: ['reference'] }],
  }
)

export default Transaction
