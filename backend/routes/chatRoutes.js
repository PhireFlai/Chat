const express = require('express')
const router = require('router')
const Chat = require("../models/Chat")
const User = require('../models/User')
const Message = require('../models/Message')


router.get('/:id', async (req, res) => {
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

    for (member in members)
        await chat.addUser(member);

    res.status(200).json({ message: 'Users added to chat successfully' });

})
router.post('/create', async (req, res) => {

})

router.get('/:id/messages/')


router.post('/:id/messages')


router.get('/:id/messages/:messageId')