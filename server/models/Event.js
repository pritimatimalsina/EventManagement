import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Event = sequelize.define("Event", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    location: {
        type: DataTypes.STRING,
        allowNull: false
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Event;