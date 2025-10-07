import { Op } from 'sequelize'
import Addon from '../../../app/addons/model'
import VirtualOffice from '../../../modules/virtual-office/models/virtualOffice.model'
import Business from './business.model'
import Industry from './industry.model'
import Ngo from './ngo.model'
import Plan from './plan.model'
import Role from './role.model'
import Subscription from './subscription.model'
import Transaction from './transaction.model'
import User from './user.model'
import Product from './product.model'

User.hasOne(VirtualOffice)
VirtualOffice.belongsTo(User)

User.belongsTo(Ngo)

Ngo.hasMany(User)

Business.belongsTo(Industry)

Industry.hasMany(Business)

// Addon.hasMany(Subscription)
// Subscription.belongsTo(Addon)

/* ************************************************** */
/* Role Associations */
/* ************************************************** */
// User to Role Relationship
User.belongsTo(Role)

// User to Subscription Relationship
User.hasMany(Subscription, {
  scope: {
    type: 'premium',
    expiresAt: { [Op.gte]: new Date() },
  },
  as: 'premuimSub',
})

// User to Subscription Relationship
User.hasMany(Subscription, {
  scope: {
    type: 'platinum',
    expiresAt: { [Op.gte]: new Date() },
  },
  as: 'platinumSub',
})
// User.hasMany(Subscription)

// User to Transaction Relationship
User.hasMany(Transaction)

// User to Transaction Relationship
User.hasOne(Business)

/* ************************************************** */
/* Role Associations */
/* ************************************************** */
// Role to Users Relationship
Role.hasMany(User)

/* ************************************************** */
/* Transaction Associations */
/* ************************************************** */
// Transaction to User Association
Transaction.belongsTo(User)

/* ************************************************** */
/* Subscription Associations */
/* ************************************************** */

// Suscription to User Association
Subscription.belongsTo(User)

// Suscription to Plan Association
// Subscription.belongsTo(Plan)

// Suscription to Transcation Association
Subscription.belongsTo(Transaction)

/* ************************************************** */
/* ************************************************** */
/* Plan Associations */
/* ************************************************** */

// Addon to Subscription Association
// Plan.hasMany(Subscription)

/* ************************************************** */
/* Business Associations */
/* ************************************************** */

// Addon to Subscription Association
Business.belongsTo(User)
Business.hasMany(Product)
Product.hasMany(Business)

export {
  User,
  Role,
  Transaction,
  Subscription,
  Plan,
  Business,
  Addon,
  VirtualOffice,
  Ngo,
  Industry,
  Product,
}
