const { Registration, Event, Attendee } = require('../models');

// CREATE REGISTRATION
const createRegistration = async (req, res) => {
    try {
        const {
            eventId,
            attendeeId
        } = req.body;

        if (!eventId || !attendeeId) {
            return res.status(400).json({
                message: 'eventId and attendeeId are required.'
            });
        }

        // Check if event exists
        const event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found.'
            });
        }

        // Check if attendee exists
        const attendee = await Attendee.findByPk(attendeeId);

        if (!attendee) {
            return res.status(404).json({
                message: 'Attendee not found.'
            });
        }

        // Check duplicate registration
        const existingRegistration = await Registration.findOne({
            where: {
                eventId,
                attendeeId
            }
        });

        if (existingRegistration) {
            return res.status(400).json({
                message: 'Attendee is already registered for this event.'
            });
        }

        const registration = await Registration.create({
            eventId,
            attendeeId,
            status: 'Registered'
        });

        res.status(201).json({
            message: 'Registration created successfully.',
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to create registration.',
            error: error.message
        });
    }
};


// GET ALL REGISTRATIONS
const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.findAll({
            include: [
                {
                    model: Event
                },
                {
                    model: Attendee
                }
            ]
        });

        res.status(200).json(registrations);

    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch registrations.',
            error: error.message
        });
    }
};


// DELETE REGISTRATION
const deleteRegistration = async (req, res) => {
    try {
        const registration = await Registration.findByPk(req.params.id);

        if (!registration) {
            return res.status(404).json({
                message: 'Registration not found.'
            });
        }

        await registration.destroy();

        res.status(200).json({
            message: 'Registration cancelled successfully.'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Failed to cancel registration.',
            error: error.message
        });
    }
};


module.exports = {
    createRegistration,
    getRegistrations,
    deleteRegistration
};