import { Static } from '@sinclair/typebox'
import { RouteHandler } from 'fastify'
import { getRecord, getRecords, success } from '../../utils/index.util'
import { addonBody } from './addon.schema'

export const getAddons: RouteHandler = async (req) =>
  // @ts-ignore
  await getRecords(req, 'Addon')

export const getAddon: RouteHandler = async (req, rep) =>
  getRecord(req, rep, 'Addon')

export const createAddon: RouteHandler = async (req) => {
  const { ...rest } = req.body as Static<typeof addonBody.create>

  // @ts-ignore
  await req.models.Addon.create(rest)

  return success('Addon Created')
}
