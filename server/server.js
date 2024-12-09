const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const userRoutes = require('./routes/userRoutes.js');
const serviceRequestRoutes = require('./routes/serviceRequestRoutes.js');
const serviceRequestController = require('./controllers/serviceRequestController'); // Import the controller
const errorMiddleware = require('./middleware/errorMiddleware');

//.env
dotenv.config();
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1); // Stop the server if critical environment variable is missing
}
console.log('MONGODB_URI:', process.env.MONGODB_URI); // This should now display the URI
//console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging line

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.IO setup
const server = http.createServer(app);
const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:3000", // frontend URL
  },
});
io.on('connection', (socket) => {
  console.log('A user connected');
  // Handle socket events here
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Pass the `io` instance to the `serviceRequestController`
serviceRequestController.setIO(io);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/service-requests', serviceRequestRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
