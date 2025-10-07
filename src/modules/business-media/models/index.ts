import Category from './categories.model'
import Media from './media.model'

Media.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' })

Category.hasMany(Media, {
  foreignKey: 'categoryId',
})

export { Media, Category }
