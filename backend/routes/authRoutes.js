const express = require('express')
const router = express.Router()
const User = require("../models/User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateUser } = require("../utils/validators")


const JWT_SECRET = process.env.JWT_SECRET || "secretKey"

router.post("/register", async (req, res) => {
    try {

        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const user = await User.create({
            username: req.body.username,
            password: hashedPassword
        })

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }
            ,
            JWT_SECRET, {
            expiresIn: "1d"
        }
        )


        res.status(201).json({
            userId: user.id,
            username: user.username,
            token: token
        })

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: "Failed to register user" })
    }
})


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body


        const user = await User.findOne({
            where: { username: username }
        })


        const isValidPass = await bcrypt.compare(password, user.password)

        if (!isValidPass || !user) {
            return res.status(401).json({ message: 'Incorrect Password or User' });
        }

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, JWT_SECRET, {
            expiresIn: '1d'
        });

        res.status(200).json({
            userId: user.id,
            username: user.username,
            email: user.email,
            token: token
        });

    } catch (error) {
        console.log("Error logging in user: ", error)
        res.status(500).json({ message: "failed to login" })
    }
})

module.exports = router;