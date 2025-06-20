const express = require('express')
const router = express.Router()
const Chat = require("../models/Chat")
const User = require('../models/User')
const Message = require("../models/Message")

router.post('/create', async (req, res) => {
    try {
        const { name, type, members } = req.body;


        // Check for DM
        if (type === 'private' && members.length === 2) {
            const [user1, user2] = members.slice().sort((a, b) => a - b);
            const chatName = `direct_${user1}_${user2}`;

            // Check if it already exists
            const existingChat = await Chat.findOne({
                where: {
                    name: chatName,
                    type: 'private'
                },
                include: [{
                    model: User,
                    as: 'Users',
                    where: { id: [user1, user2] },
                    through: { attributes: [] }

                }]
            });

            if (existingChat) {
                return res.status(200).json({
                    message: 'Chat already exists',
                    chat: existingChat
                });
            }

            // Create new chat
            const chat = await Chat.create({
                name: chatName,
                type: 'private'
            });

            const users = await User.findAll({ where: { id: [user1, user2] } });
            await chat.addUsers(users);

            return res.status(201).json({
                message: 'Chat created',
                chat
            });
        } else {

            const chat = await Chat.create({
                name,
                type,
            });

            const users = await User.findAll({
                where: { id: members }
            });

            if (users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }

            // Add all users at once
            await chat.addUsers(users);

            return res.status(201).json({
                message: 'Chat created',
                chat
            });
        }
    } catch (error) {
        console.log("Error creating Chat:", error);
        res.status(500).json({ message: "Failed to create Chat" })
    }

})


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId; // set by your authenticate middleware


        const chat = await Chat.findByPk(id, {
            include: [{
                model: User,
                as: 'Users',
                where: { id: userId }
            }]
        });

        if (!chat) {
            res.status(403).json({ message: "You are not a member of this chat!" })
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Failed to find Chat" })
    }


})

router.post('/:id/add-users', async (req, res) => {
    try {
        const { id } = req.params
        const { userIds } = req.body;
        const userId = req.user.userId;

        const chat = await Chat.findByPk(id, {
            include: [{
                model: User,
                as: 'Users',
                where: { id: userId }
            }]
        });


        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const users = await User.findAll({ where: { id: userIds } });
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }


        await chat.addUsers(users);

        res.status(200).json({ message: 'Users added to chat successfully' });
    } catch (error) {
        console.error("Error adding users to chat:", error);
        res.status(500).json({ message: "Failed to add users to chat" });
    }
});

router.get('/:id/messages', async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user.userId;

        const chat = await Chat.findByPk(id, {
            include: [{
                model: User,
                as: 'Users',
                where: { id: userId }
            }]
        });

        if (!chat) {
            return res.status(403).json({ message: "You are not a member of this chat!" });
        }

        const messages = await Message.findAll({
            where: { chatId: id },
            order: [['createdAt', 'ASC']],
            include: [{
                model: User,
                as: 'sender',
            }]
        });


        res.status(200).json(messages);

    } catch (error) {
        console.error("Error getting messages from chat:", error);
        res.status(500).json({ message: "Failed to get messages " })
    }
})


router.post('/:id/message', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;


        const chat = await Chat.findByPk(id, {
            include: [{
                model: User,
                as: 'Users',
                where: { id: userId }
            }]
        });

        if (!chat) {
            return res.status(403).json({ message: "You are not a member of this chat" });
        }


        const message = await Message.create({
            content,
            chatId: id,
            senderId: userId
        });

        res.status(201).json(message);

    } catch (error) {
        res.status(500).json({ message: "Failed to send message" })
    }

})


router.get('/:id/messages/:messageId', async (req, res) => {
    try {
        const { id, messageId } = req.params;

        const message = await Message.findOne({
            where: {
                id: messageId,
                chatId: id
            }
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found in this chat" });
        }

        res.status(200).json(message);

    } catch (error) {
        console.error("Error getting message from chat:", error);
        res.status(500).json({ message: "Failed to get messages " })
    }
})

router.post('/:id/rename', async (req, res) => {
    try {
        const { id } = req.params;
        const { newName } = req.body;

        const chat = await Chat.findByPk(id, {
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not Found" });
        }
        chat.name = newName;

        await chat.save();
        res.status(200).json(chat);

    } catch (error) {
        console.log("Failed to rename chatname", error)
    }
})

module.exports = router