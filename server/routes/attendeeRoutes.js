import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";

import {
    createAttendee,
    getAttendees,
    getAttendeeById,
    updateAttendee,
    deleteAttendee
} from "../controllers/attendeeController.js";

const router = express.Router();

// GET all attendees
router.get("/", authenticateToken, getAttendees);

// GET attendee by ID
router.get("/:id", authenticateToken, getAttendeeById);

// CREATE attendee
router.post("/", authenticateToken, createAttendee);

// UPDATE attendee
router.put("/:id", authenticateToken, updateAttendee);

// DELETE attendee
router.delete("/:id", authenticateToken, deleteAttendee);

export default router;