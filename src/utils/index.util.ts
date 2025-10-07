import { FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import { FindOptions, ModelDefined, Op, OrderItem } from "sequelize";

export const testRoute = async (req: FastifyRequest) => ({
  message: `${req.url} works`,
});

export const dateTimeNow = () => moment().format("YYYY-MM-DD HH:mm:ss");

export const success = (message: string) => ({
  code: 200,
  success: true,
  message,
});

export const getPagingData = (
  data: { count: number; rows: any[] },
  page: number,
  limit: number
) => {
  const { count: totalItems, rows: records } = data;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, records, totalPages, currentPage };
};

export const getPagination = (page: number, size: string) => {
  const limit = size ? parseInt(size) : 12;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const setSchema = ({
  _2xx = { $ref: "2xx#" },
  withAuth = false,
  desc = "Schema",
  ...rest
}) => ({
  response: { "2xx": _2xx, "4xx": { $ref: "4xx#" } },
  headers: {
    type: "object",
    $ref: "header#",
    required: withAuth ? ["Authorization"] : [],
  },
  description: desc,
  ...rest,
});

export const getRecords = async (
  req: FastifyRequest,
  // @ts-ignore
  model: ModelDefined<any, {}> | keyof typeof req.models,
  options:
    | (FindOptions<any> & {
        useParams?: boolean;
        useBody?: boolean;
        useQuery?: boolean;
        paginate?: boolean;
        hasDistinctDate?: boolean;
        allowedFillters?: string[];
        allowedSearchFields?: string[];
      })
    | undefined = {}
) => {
  const { ...params } = (req.params as any) || {},
    { ...body } = (req.body as any) || {},
    {
      page,
      size,
      q,
      sortBy,
      order: _order,
      filterBy,
      filter,
      startDate,
      endDate,
    } = (req.query as any) || {},
    {
      useBody,
      useParams,
      useQuery,
      paginate = true,
      hasDistinctDate,
      allowedFillters = [],
      allowedSearchFields = [],
      where: _where,
      ...restOpt
    } = options!;

  let where: any = {},
    order: OrderItem[] = sortBy ? [[sortBy, _order]] : [];

  if (_where) where = _where;
  else {
    if (useBody) where = { ...where, ...body };
    if (useParams) where = { ...where, ...params };
  }
  if (q)
    where = {
      ...where,
      [Op.or]: allowedSearchFields.map((_) => ({
        [_]: { [Op.like]: `%${q}%` },
      })),
    };
  if (filterBy && filter && allowedFillters.includes(filterBy))
    where[
      filterBy.search("_") ? `$${filterBy.split("_").join(".")}$` : filterBy
    ] = filter;

  if (startDate || endDate)
    where = {
      ...where,
      ...(hasDistinctDate
        ? { startDate: { [Op.between]: [startDate, endDate] } }
        : {
            createdAt: {
              [Op.and]: {
                ...(startDate ? { [Op.gte]: startDate } : {}),
                ...(endDate ? { [Op.lte]: endDate } : {}),
              },
            },
          }),
    };
  // console.log({ where, order, filterBy, filter });
  const args = paginate ? getPagination(page, size) : {},
    records = await (typeof model == "string"
      ? // @ts-ignore
        req.models[model]
      : model
    ).findAndCountAll({ order, ...args, ...restOpt, where });

  // @ts-ignore
  return paginate ? getPagingData(records, page, args.limit) : records.rows;
};
export const getRecord = async (
  req: FastifyRequest,
  rep: FastifyReply,
  // @ts-ignore
  model: ModelDefined<any, {}> | keyof typeof req.models,
  options?:
    | (FindOptions<any> & {
        useParams?: boolean;
        useBody?: boolean;
        useQuery?: boolean;
        isMine?: boolean;
      })
    | undefined
) => {
  const { ...params } = req.params || ({} as any),
    { ...body } = req.body || ({} as any),
    { ...query } = req.query || ({} as any),
    { useBody, useParams, useQuery, where: _where, ...restOpt } = options!;

  let where: any = {};

  if (_where) where = _where;

  if (useBody) where = { ...where, ...body };
  if (useQuery) where = { ...where, ...query };
  if (useParams) where = { ...where, ...params };

  if (restOpt.isMine) {
    where.userId = req.userModel?.dataValues.id;
  }

  const record = await (typeof model == "string"
    ? // @ts-ignore
      req.models[model]
    : model
  ).findOne({ where, ...restOpt });

  // @ts-ignore
  if (!record) throw rep.notFound(`${model} not found`);

  return record;
};

export const uppercaseFirst = (str: string) =>
  `${str[0].toUpperCase()}${str.substr(1)}`;

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
