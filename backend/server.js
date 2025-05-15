const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const userRoutes = require("./routes/userRoutes")
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middleware/auth');

const User = require('./models/User')
dotenv.config();

const app = express();

app.use(cors());


app.use(cors({
    origin: ['http://localhost:3000', 'localhost'], // React app
    credentials: true
}))


app.use(express.json());

// Database connection
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT || 3306,
});

// API test endpoint
app.get('/api/test', async (req, res) => {
  try {
        const users = await User.findAll({
            attributes: ['id', 'username']
        })
        res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});