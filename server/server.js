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
        origin: "http://localhost:5173",
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
    express.static(
        path.join(__dirname, "images")
    )
);

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/attendees", attendeeRoutes);

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Eventify API is running successfully."
    });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log(
            "Database connected successfully!"
        );

        await sequelize.sync();

        console.log(
            "Database tables created successfully!"
        );

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Unable to start server:",
            error
        );
    }
}

startServer();