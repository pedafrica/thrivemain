import { RouteHandler } from 'fastify'
import { getRecord, getRecords } from '../../utils/index.util'

export const getBusinsesses: RouteHandler = async (req) =>
  getRecords(req, 'Business', {
    allowedSearchFields: [
      'name',
      'email',
      'phone',
      'country',
      'address',
      'state',
      '$industry.name$',
    ],
    allowedFillters: ['industryId'],
    include: req.models.Industry,
  })

export const getBusinsess: RouteHandler = async (req, rep) =>
  getRecord(req, rep, 'Business')
