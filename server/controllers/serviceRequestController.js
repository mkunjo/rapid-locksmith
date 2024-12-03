const ServiceRequest = require('../models/ServiceRequest');
const io = require('socket.io'); 

const createServiceRequest = async (req, res) => {
  const { location, serviceType } = req.body;

  try {
    const newServiceRequest = new ServiceRequest({
      location,
      serviceType,
      customerId: req.user._id 
    });

    await newServiceRequest.save();

    // Emit a notification to all connected clients
    io.emit('newServiceRequest', newServiceRequest);

    res.status(201).json({ message: 'Service request created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createServiceRequest
};