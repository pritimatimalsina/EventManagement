import User from "./User.js";
import Event from "./Event.js";
import Attendee from "./Attendee.js";
import Registration from "./Registration.js";

// ===============================
// RELATIONSHIPS
// ===============================

// Event ↔ Registration
Event.hasMany(Registration, {
    foreignKey: "eventId",
    onDelete: "CASCADE"
});

Registration.belongsTo(Event, {
    foreignKey: "eventId"
});

// Attendee ↔ Registration
Attendee.hasMany(Registration, {
    foreignKey: "attendeeId",
    onDelete: "CASCADE"
});

Registration.belongsTo(Attendee, {
    foreignKey: "attendeeId"
});

// Event ↔ Attendee
Event.belongsToMany(Attendee, {
    through: Registration,
    foreignKey: "eventId",
    otherKey: "attendeeId"
});

Attendee.belongsToMany(Event, {
    through: Registration,
    foreignKey: "attendeeId",
    otherKey: "eventId"
});

// ===============================
// EXPORT
// ===============================

export {
    User,
    Event,
    Attendee,
    Registration
};