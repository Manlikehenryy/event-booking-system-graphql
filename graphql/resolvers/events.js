import Event from "../../models/event.js";
import User from "../../models/user.js";
import { transformEvent } from "./merge.js";

const eventsResolvers = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated");
      }

      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: req.userId,
      });

      let createdEvent;

      await event.save();

      createdEvent = transformEvent(event);

      const existingUser = await User.findById(req.userId);

      if (!existingUser) {
        throw new Error("User not found.");
      }

      existingUser.createdEvents.push(event);
      await existingUser.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
};

export default eventsResolvers;
