const express = require('express')
const router = express.Router()
const Chat = require("../models/Chat")
const User = require('../models/User')
const Message = require('../models/Message')


router.post('/create', async (req, res) => {
    try {
        const { name, type, members } = req.body;
        const chat = Chat.create({
            name,
            type,
        })

        const users = await User.findAll({
            where: { id: members }
        })

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        await Promise.all(
            users.map(user => chat.addUser(user))
        );



        res.status(200).json({ message: 'Users added to chat successfully' });
    } catch (error) {
        console.log("Error creating Chat:", error);
        res.status(500).json({ message: "Failed to create Chat" })
    }

})


// router.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params; // Chat ID

//     }


// })

router.post('/:id/add-users', async (req, res) => {
    try {
        const { id } = req.params;
        const { userIds } = req.body;

        const chat = await Chat.findByPk(id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const users = await User.findAll({ where: { id: userIds } });
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Add users to the chat
        await Promise.all(
            users.map(user => chat.addUser(user)) // Sequelize association method
        );

        res.status(200).json({ message: 'Users added to chat successfully' });
    } catch (error) {
        console.error("Error adding users to chat:", error);
        res.status(500).json({ message: "Failed to add users to chat" });
    }
});

// router.get('/:id/messages')


// router.post('/:id/message')


// router.get('/:id/messages/:messageId')

module.exports = router