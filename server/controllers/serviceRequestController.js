const ServiceRequest = require('../models/ServiceRequest');

let io; // Declare a variable to hold the io instance

// Function to set the io instance from server.js
const setIO = (socketIOInstance) => {
  io = socketIOInstance;
};

const createServiceRequest = async (req, res) => {
  const { location, serviceType } = req.body;

  try {
    const newServiceRequest = new ServiceRequest({
      location,
      serviceType,
      customerId: req.user._id 
    });

    await newServiceRequest.save();

    // Emit a notification to all connected locksmiths
    io.emit('newServiceRequest', newServiceRequest);

    res.status(201).json({ message: 'Service request created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const handleServiceRequest = async (socket, requestId, action) => {
  try {
    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return;
    }

    if (action === 'accept') {
      serviceRequest.status = 'accepted';
      serviceRequest.assignedLocksmith = socket.id; // Assign the locksmith based on socket ID
    } else if (action === 'reject') {
      serviceRequest.status = 'rejected';
    }

    await serviceRequest.save();

    // Emit a notification to the customer and the locksmith
    io.to(serviceRequest.customerId).emit('serviceRequestUpdated', serviceRequest);
    io.to(socket.id).emit('serviceRequestUpdated', serviceRequest);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  setIO, // Export the setIO function to be called from server.js
  createServiceRequest,
  handleServiceRequest
};
