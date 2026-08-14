
// UPDATE ATTENDEE
const updateAttendee = async (req, res) => {
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

