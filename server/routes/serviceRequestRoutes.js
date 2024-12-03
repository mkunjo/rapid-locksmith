const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');

router.post('/', serviceRequestController.createServiceRequest);

module.exports = router;