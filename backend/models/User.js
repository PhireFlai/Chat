const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');
const Follow = require('./Follow');
const Chat = require('./Chat');
const Message = require('./Message')
const ChatUser = require("./ChatUser")

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});





module.exports = User;

