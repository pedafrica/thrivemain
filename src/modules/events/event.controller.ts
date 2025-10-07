import { Static } from "@sinclair/typebox";
import { RouteHandler } from "fastify";
import { getRecord, getRecords, success } from "../../utils/index.util";
import { Application, Event, EventCategory, EventOrganizer } from "./models";
import { eventSchema } from "./event.schema";

// Events Functions
export const doGetEvents: RouteHandler = async (req) =>
  await getRecords(req, Event, {
    include: [
      { model: EventCategory, as: "category" },
      { model: EventOrganizer, as: "organizer" },
    ],
    allowedSearchFields: ["name", "$category.name$", "$organizer.name$"],
    allowedFillters: ["categoryId", "organizerId"],
    hasDistinctDate: true,
  });

export const doGetEvent: RouteHandler = async (req, rep) =>
  getRecord(req, rep, Event, { include: [EventCategory, EventOrganizer] });

export const doCreateEvent: RouteHandler = async (req, rep) => {
  const { categoryId, organizerId, ...rest } = req.body as Static<
    typeof eventSchema.create
  >;

  const organizer = await EventOrganizer.findByPk(organizerId);

  // @ts-ignore
  if (!organizer) rep.notFound("Organizer Not Found");

  const category = await EventCategory.findByPk(categoryId);

  // @ts-ignore
  if (!category) rep.notFound("Event category not found");

  await Event.create({ ...rest, categoryId, organizerId });

  return success("Event Successfully Created");
};

// Event Organizers Functions

export const doGetOrganizers: RouteHandler = async (req) =>
  await getRecords(req, EventOrganizer, { paginate: false });

export const doGetOrganizer: RouteHandler = async (req, rep) =>
  await getRecord(req, rep, EventOrganizer);

export const doCreateOrganizer: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof eventSchema.createOrganizer
  >;

  // @ts-ignore
  let [organizer, created] = await EventOrganizer.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Event Organizer with same name already exists");

  return success("Event Organizer Added");
};

// Event Category Functions
export const doCreateCategory: RouteHandler = async (req, rep) => {
  const { name, ...rest } = req.body as Static<
    typeof eventSchema.createCategory
  >;

  let [event, created] = await EventCategory.findOrCreate({
    where: { name },
    defaults: { name, ...rest },
  });
  // @ts-ignore
  if (!created) rep.conflict("Category with same name already exists");

  return success("Event category created");
};

export const doGetCategories: RouteHandler = async (req) =>
  await getRecords(req, EventCategory, { paginate: false });

//Event Application Functions
export const doCreateApplication: RouteHandler = async (req, rep) => {
  const { eventId } = req.params as Static<
    typeof eventSchema.createApplication
  >;

  const service = await Event.findByPk(eventId);
  if (!service) rep.notFound("Event not found");

  // @ts-ignore
  // await service!.addUser(req.models.User, { through: Application });
  await Application.create({
    eventId,
    userId: req.userModel?.dataValues.id,
  });
  return success("Application successful");
};

export const doGetApplications: RouteHandler = async (req) =>
  await getRecords(req, Application, { useParams: true });
export const doGetApplication: RouteHandler = async (req, rep) =>
  await getRecord(req, rep, Application);

export const deleteEvent: RouteHandler<{
  Params: { id: number };
}> = async (req, res) => {
  const { id } = req.params;

  await Event.destroy({ where: { id } });
  return success("Item successfully deleted");
};
