
import { Event } from "../models/index.js";

// ===============================
// VALIDATION FUNCTION
// ===============================

const validateEventData = ({
    name,
    description,
    date,
    location,
    category,
    capacity
}) => {
    if (!name || !description || !date || !location || !category) {
        return "Name, description, date, location and category are required.";
    }

    if (
        capacity === undefined ||
        capacity === null ||
        capacity === ""
    ) {
        return "Capacity is required.";
    }

    if (!Number.isInteger(Number(capacity)) || Number(capacity) <= 0) {
        return "Capacity must be a positive whole number.";
    }

    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime())) {
        return "Please provide a valid event date.";
    }

    return null;
};


// ===============================
// CREATE EVENT
// ===============================

const createEvent = async (req, res) => {
    try {
        const {
            name,
            description,
            date,
            location,
            category,
            capacity,
            image
        } = req.body;

        const validationError = validateEventData({
            name,
            description,
            date,
            location,
            category,
            capacity
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const event = await Event.create({
            name: name.trim(),
            description: description.trim(),
            date,
            location: location.trim(),
            category: category.trim(),
            capacity: Number(capacity),
            image: image || null
        });

        res.status(201).json({
            message: "Event created successfully.",
            event
        });

    } catch (error) {
        console.error("Create event error:", error);

        res.status(500).json({
            message: "Failed to create event.",
            error: error.message
        });
    }
};


// ===============================
// GET ALL EVENTS
// ===============================

const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();

        res.status(200).json(events);

    } catch (error) {
        console.error("Get events error:", error);

        res.status(500).json({
            message: "Failed to fetch events.",
            error: error.message
        });
    }
};


// ===============================
// GET EVENT BY ID
// ===============================

const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.status(200).json(event);

    } catch (error) {
        console.error("Get event error:", error);

        res.status(500).json({
            message: "Failed to fetch event.",
            error: error.message
        });
    }
};


// ===============================
// UPDATE EVENT
// ===============================

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        const updatedData = {
            name: req.body.name ?? event.name,
            description: req.body.description ?? event.description,
            date: req.body.date ?? event.date,
            location: req.body.location ?? event.location,
            category: req.body.category ?? event.category,
            capacity: req.body.capacity ?? event.capacity
        };

        const validationError = validateEventData(updatedData);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        if (req.body.image !== undefined) {
            updatedData.image = req.body.image;
        }

        await event.update({
            name: updatedData.name.trim(),
            description: updatedData.description.trim(),
            date: updatedData.date,
            location: updatedData.location.trim(),
            category: updatedData.category.trim(),
            capacity: Number(updatedData.capacity),
            ...(updatedData.image !== undefined
                ? { image: updatedData.image }
                : {})
        });

        res.status(200).json({
            message: "Event updated successfully.",
            event
        });

    } catch (error) {
        console.error("Update event error:", error);

        res.status(500).json({
            message: "Failed to update event.",
            error: error.message
        });
    }
};


// ===============================
// DELETE EVENT
// ===============================

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        await event.destroy();

        res.status(200).json({
            message: "Event deleted successfully."
        });

    } catch (error) {
        console.error("Delete event error:", error);

        res.status(500).json({
            message: "Failed to delete event.",
            error: error.message
        });
    }
};


// ===============================
// EXPORT
// ===============================

export {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};

