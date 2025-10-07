import { RouteHandler } from 'fastify'

export const getBusiness: RouteHandler = async (req, rep) => {
  // @ts-expect-error
  const business = await req.userModel!.getBusiness({
    include: req.models.Product,
  })

  if (!business) rep.notFound('Business details not found')

  return business
}
