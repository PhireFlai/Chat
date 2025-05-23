const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Follow = require('../models/Follow');



// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username']
        })
        res.status(201).json(users);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'username']
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user, something went wrong' });
    }
});

//Follow a user
router.post('/:userId/follow/:otherId', async (req, res) => {
    try {
        const actorId = req.params.userId;
        const objectId = req.params.otherId;

        const user = await User.findOne({
            where: { id: actorId },
            attributes: ['id', 'username']
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const other = await User.findOne({
            where: { id: objectId },
            attributes: ['id', 'username']
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const follow = await Follow.create({
            userId: user.id,
            otherId: other.id
        })

        res.status(201).json(follow);
    } catch (error) {
        console.log("error following user: ", error);
        res.status(500).json({ message: "Failed to follow user" })
    }

})

router.get("/:id/followed", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({
            where: { id: userId },
            include: [{
                as: 'Following',
                model: User,
                attributes: ["id", "username"],
                required: false

            }]
        }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followedUsers = user.Following;

        res.json(followedUsers)
    } catch (error) {
        console.error("Error fetching followed Users", error);
        res.status(500).json({ message: "failed to fetch followed users" })
    }
});


module.exports = router;