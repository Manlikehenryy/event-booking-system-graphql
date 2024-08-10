import authResolvers from "./auth.js";
import eventsResolvers from "./events.js";
import bookingsResolver from "./bookings.js";

const rootResolvers = {
    ...bookingsResolver,
    ...authResolvers,
    ...eventsResolvers
}

export default rootResolvers;