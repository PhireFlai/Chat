// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');

    // Check if the header exists and is a string
    if (!authHeader || typeof authHeader !== 'string') {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    // Split the header into token type and token
    const parts = authHeader.split(' ');

    // Verify there are exactly two parts
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ message: 'Invalid token format.' });
    }

    const token = parts[1];


    if (!token || typeof token !== 'string') {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }


    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authenticate;