const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');

// Middleware for authentication (if necessary)
const authenticateUser = (req, res, next) => {
  // Authentication logic here
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  next();
};

// Middleware for validating service request data (if necessary)
const validateServiceRequest = (req, res, next) => {
  const { location, serviceType } = req.body;
  if (!location || !serviceType) {
    return res.status(400).json({ message: 'Location and serviceType are required' });
  }
  next();
};

// Route to create service request with middleware
router.post(
  '/',
  authenticateUser,  // Authentication middleware here
  validateServiceRequest, // Validation middleware here
  serviceRequestController.createServiceRequest // Controller logic
);

module.exports = router;
