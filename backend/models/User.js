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

User.belongsToMany(User, {
    as: 'Followers',
    through: Follow,
    foreignKey: 'userId',
    otherKey: 'followingId',
});

User.belongsToMany(User, {
    as: 'Following',
    through: Follow,
    foreignKey: 'followingId',
    otherKey: 'userId',
});

User.hasMany(Message, {
    as: "sentMessages",
    foreignKey: 'senderId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})

User.belongsToMany(Chat, {
    as: "Chat",
    through: ChatUser,
    foreignKey: 'userId',
    otherKey: "chatId",
}
)



module.exports = User;

