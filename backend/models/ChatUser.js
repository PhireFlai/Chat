const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const ChatUser = sequelize.define('ChatUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false

    }
});

module.exports = ChatUser;