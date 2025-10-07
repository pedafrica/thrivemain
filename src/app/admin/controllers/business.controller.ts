import { RouteHandler } from 'fastify'
import { getRecord, getRecords } from '../../../utils/index.util'

export const getBusinsesses: RouteHandler = async (req) =>
  getRecords(req, 'Business')
