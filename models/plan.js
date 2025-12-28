const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: String,
    price: Number,
    durationMonths: Number,
    features: [String],
    isPopular: { type: Boolean, default: false },
    colorClass: String
});

module.exports = mongoose.model('Plan', planSchema);