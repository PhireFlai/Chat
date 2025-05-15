const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validateUser } = require('../utils/validators');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username']
        })
        res.json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findOne({
            where: {id: req.params.id},
            attributes: ['id', 'username']
        });
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user, something went wrong' });
    }
});



module.exports = router;