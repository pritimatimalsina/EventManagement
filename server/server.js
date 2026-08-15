
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import sequelize from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";

import "./models/index.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// MIDDLEWARE
// ===============================

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// IMAGES
// ===============================

app.use(
    "/images",
    express.static(path.join(__dirname, "images"))
);

// ===============================
// DATABASE CONNECTION
// ===============================

let databaseReady = false;

async function connectDatabase() {
    if (databaseReady) return;

    await sequelize.authenticate();
    await sequelize.sync();

    databaseReady = true;

    console.log("Database connected successfully!");
    console.log("Database tables created successfully!");
}

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/attendees", attendeeRoutes);

// ===============================
// HOME
// ===============================

app.get("/", async (req, res) => {
    try {
        await connectDatabase();

        res.json({
            message: "Eventify API is running successfully."
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed."
        });
    }
});

// ===============================
// DATABASE INITIALIZATION
// ===============================

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error("Unable to connect to database:", error);

        res.status(500).json({
            message: "Unable to connect to database."
        });
    }
});





