
import Event from "../models/Event.js";

// ===============================
// CREATE EVENT
// ===============================
export const createEvent = async (req, res) => {
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

        if (
            !name ||
            !description ||
            !date ||
            !location ||
            !category ||
            capacity === undefined
        ) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        if (capacity <= 0) {
            return res.status(400).json({
                message: "Capacity must be greater than 0."
            });
        }

        const event = await Event.create({
            name,
            description,
            date,
            location,
            category,
            capacity,
            image
        });

        res.status(201).json({
            message: "Event created successfully.",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create event.",
            error: error.message
        });
    }
};


// ===============================
// GET ALL EVENTS
// ===============================
export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll();

        res.status(200).json({
            message: "Events retrieved successfully.",
            events
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve events.",
            error: error.message
        });
    }
};


// ===============================
// GET EVENT BY ID
// ===============================
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        res.status(200).json({
            message: "Event retrieved successfully.",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve event.",
            error: error.message
        });
    }
};


// ===============================
// UPDATE EVENT
// ===============================
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found."
            });
        }

        const {
            name,
            description,
            date,
            location,
            category,
            capacity,
            image
        } = req.body;

        if (
            !name ||
            !description ||
            !date ||
            !location ||
            !category ||
            capacity === undefined
        ) {
            return res.status(400).json({
                message: "All required fields must be provided."
            });
        }

        if (capacity <= 0) {
            return res.status(400).json({
                message: "Capacity must be greater than 0."
            });
        }

        await event.update({
            name,
            description,
            date,
            location,
            category,
            capacity,
            image
        });

        res.status(200).json({
            message: "Event updated successfully.",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update event.",
            error: error.message
        });
    }
};


// ===============================
// DELETE EVENT
// ===============================
export const deleteEvent = async (req, res) => {
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
        res.status(500).json({
            message: "Failed to delete event.",
            error: error.message
        });
    }
};
