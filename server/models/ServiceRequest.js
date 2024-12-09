const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
    location: { type: String, required: true },
    serviceType: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    assignedLocksmith: { type: String, default: null },
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);