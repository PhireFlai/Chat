const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path')

const { sequelize } = require('./models/db');
const defineAssociations = require('./models/associations');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const authenticate = require('./middleware/auth');

const http = require('http')
const { Server } = require('socket.io')

const PATH = 'uploads/images/';
if (!fs.existsSync(PATH)) {
  fs.mkdirSync(PATH, { recursive: true });
}

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

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


// Image serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/chats', authenticate, chatRoutes);

// Start server only after DB is connected
const PORT = process.env.PORT || 5000;


// retry connection to database if it fails
const connectDBWithRetry = async (maxRetries = 10, retryInterval = 5000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to connect to database (attempt ${attempt}/${maxRetries})...`);
      await sequelize.authenticate();
      console.log('Database connected successfully!');
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        console.error('Maximum retry attempts reached. Unable to connect to database.');
        return false;
      }
      
      console.log(`Retrying in ${retryInterval / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

(async () => {

  try {

    await connectDBWithRetry();
    console.log('Database connected.');

    await sequelize.sync({ alter: true }); // or { alter: true } or { force: true }
    console.log('Models synced.');

    await defineAssociations();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

})();
