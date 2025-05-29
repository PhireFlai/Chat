const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models/db');
const defineAssociations = require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authenticate = require('./middleware/auth');

dotenv.config();

const app = express();

app.use(cors())

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/chat', authenticate, chatRoutes);

// Start server only after DB is connected
const PORT = process.env.PORT || 5000;


(async () => {

  try {

    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ force: true }); // or { alter: true } or { force: true }
    console.log('Models synced.');
    
    await defineAssociations();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

})();
