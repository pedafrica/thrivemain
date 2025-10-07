import Category from './categories.model'
import Template from './template.model'

Template.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })

Category.hasMany(Template, {
  foreignKey: 'categoryId',
})
export { Template, Category }
