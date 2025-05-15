const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const message = sequelize.define('Message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        references: {
            model: "User",
            key: "id",
        }
    },
    recieverId: {
        references: {
            model: "User",
            key: "id",
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});


module.exports = Message;

