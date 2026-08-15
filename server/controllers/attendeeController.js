
import Attendee from "../models/Attendee.js";

// ===============================
// CREATE ATTENDEE
// ===============================
export const createAttendee = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone
        } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: "First name, last name and email are required."
            });
        }

        const attendee = await Attendee.create({
            firstName,
            lastName,
            email,
            phone
        });

        res.status(201).json({
            message: "Attendee created successfully.",
            attendee
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create attendee.",
            error: error.message
        });
    }
};


// ===============================
// GET ALL ATTENDEES
// ===============================
export const getAttendees = async (req, res) => {
    try {
        const attendees = await Attendee.findAll();

        res.status(200).json({
            message: "Attendees retrieved successfully.",
            attendees
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve attendees.",
            error: error.message
        });
    }
};


// ===============================
// GET ATTENDEE BY ID
// ===============================
export const getAttendeeById = async (req, res) => {
    try {
        const attendee = await Attendee.findByPk(req.params.id);

        if (!attendee) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        res.status(200).json({
            message: "Attendee retrieved successfully.",
            attendee
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve attendee.",
            error: error.message
        });
    }
};


// ===============================
// UPDATE ATTENDEE
// ===============================
export const updateAttendee = async (req, res) => {
    try {
        const attendee = await Attendee.findByPk(req.params.id);

        if (!attendee) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        const {
            firstName,
            lastName,
            email,
            phone
        } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                message: "First name, last name and email are required."
            });
        }

        await attendee.update({
            firstName,
            lastName,
            email,
            phone
        });

        res.status(200).json({
            message: "Attendee updated successfully.",
            attendee
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update attendee.",
            error: error.message
        });
    }
};


// ===============================
// DELETE ATTENDEE
// ===============================
export const deleteAttendee = async (req, res) => {
    try {
        const attendee = await Attendee.findByPk(req.params.id);

        if (!attendee) {
            return res.status(404).json({
                message: "Attendee not found."
            });
        }

        await attendee.destroy();

        res.status(200).json({
            message: "Attendee deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete attendee.",
            error: error.message
        });
    }
};

