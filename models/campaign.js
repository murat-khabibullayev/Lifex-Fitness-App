const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    urlId: { type: String, required: true, unique: true },
    title: String,
    subtitle: String,
    image: String,
    description: String,
    conditions: [String]
});

module.exports = mongoose.model('Campaign', campaignSchema);