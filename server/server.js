const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const http = require('http');

const userRoutes = require('./routes/userRoutes.js');
const socketHandler = require('./socket/socketHandler');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "rapidunlock.com" //frontend URL
    }
});
io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle socket events here
  socket.on('disconnect', () => {
      console.log('User disconnected'); 
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);

// Error handling middleware
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});