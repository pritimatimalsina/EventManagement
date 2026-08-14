import express from "express";

import authenticateToken from "../middleware/authMiddleware.js";

import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} from "../controllers/eventController.js";

const router = express.Router();

// GET all events
router.get("/", getEvents);

// GET event by ID
router.get("/:id", getEventById);

// CREATE event - protected
router.post("/", authenticateToken, createEvent);

// UPDATE event - protected
router.put("/:id", authenticateToken, updateEvent);

// DELETE event - protected
router.delete("/:id", authenticateToken, deleteEvent);

export default router;