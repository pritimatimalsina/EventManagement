import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Registration = sequelize.define("Registration", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    attendeeId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    registrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Registered"
    }
});

export default Registration;