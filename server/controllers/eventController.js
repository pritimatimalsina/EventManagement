
// UPDATE EVENT
const updateEvent = async (req, res) => {
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

