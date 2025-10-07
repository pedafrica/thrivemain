import { User } from '../../../app/users/models'
import EventCategory from './categories.model'
import Event from './event.model'
import EventOrganizer from './organizers.model'
import Application from './application.model'

Event.belongsTo(EventCategory, { foreignKey: 'categoryId', as: 'category' })
Event.belongsTo(EventOrganizer, { foreignKey: 'organizerId', as: 'organizer' })

User.belongsToMany(Event, { through: Application })

Event.belongsToMany(User, { through: Application })

User.hasMany(Application)
Application.belongsTo(User)
Event.hasMany(Application)
Application.belongsTo(Event)

export { Event, EventCategory, EventOrganizer, Application }
