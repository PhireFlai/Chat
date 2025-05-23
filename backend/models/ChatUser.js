const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const ChatUser = sequelize.define('Follow', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    chatId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Chat',
            key: 'id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    }
});

module.exports = ChatUser;