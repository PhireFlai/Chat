const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models/db');
const defineAssociations = require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authenticate = require('./middleware/auth');
const http = require('http')
const { Server } = require('socket.io')

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost'],
  credentials: true,
}));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost'],
    credentials: true,
  }
});


io.on('connection', (socket) => {
  console.log("User Connected ", socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);

  })

  socket.on('sendMessage', (data) => {
    console.log(`Message to ${data.chatId}:`, data.message);
    io.to(data.chatId).emit('receiveMessage', data.message);
  })

  socket.on('disconnect', () => {
    console.log('User disconnected ', socket.id)
  })
})




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

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

})();
