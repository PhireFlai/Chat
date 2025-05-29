const User = require('./User');
const Chat = require('./Chat');
const ChatUser = require('./ChatUser');
const Message = require('./Message');
const Follow = require("./Follow");

const defineAssociations = () => {


    User.belongsToMany(User, {
        as: 'Followers',
        through: Follow,
        foreignKey: 'followingId',
        otherKey: 'followerId'
    });

    User.belongsToMany(User, {
        as: 'Following',
        through: Follow,
        foreignKey: 'followerId',
        otherKey: 'followingId'
    });

    User.hasMany(Message, {
        as: "sentMessages",
        foreignKey: 'senderId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })

    Message.belongsTo(User, {
        as: "sender",
        foreignKey: 'senderId'
    });

    User.belongsToMany(Chat, {
        through: ChatUser,
        as: 'Chats',
        foreignKey: 'userId',
    });


    Chat.belongsToMany(User, {
        through: ChatUser,
        as: 'Users',
        foreignKey: 'chatId',
    });

    Message.belongsTo(Chat, {
        as: "chat",
        foreignKey: 'chatId'
    });

    Chat.hasMany(Message, {
        as: "messages",         
        foreignKey: 'chatId',    
        onDelete: 'CASCADE',      
        onUpdate: 'CASCADE'      
    });

};

module.exports = defineAssociations;