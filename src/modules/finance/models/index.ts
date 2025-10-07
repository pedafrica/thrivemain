import { User } from '../../../app/users/models'
import Institution from './institution.model'
import Service from './service.model'
import Category from './category.model'
import Application from './application.model'

Service.belongsTo(Institution, {
  foreignKey: 'institutionId',
  as: 'institution',
})
Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

User.belongsToMany(Service, { through: Application, foreignKey: 'userId' })

Service.belongsToMany(User, { through: Application, foreignKey: 'serviceId' })

// User.hasMany(Application)
// Application.belongsTo(User)
// Service.hasMany(Application)
// Application.belongsTo(Service)

export { Service, Institution, Category }
