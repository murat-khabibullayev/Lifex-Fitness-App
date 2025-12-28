const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: String,
    city: String,
    district: String,
    mapUrl: String,
    tags: [String],
    image: String,
    description: String,
    address: String,
    phone: String,
    hours: String,
    // Kulübün İmkanları
    facilities: [{
        title: String,
        text: String,
        image: String
    }]
});

module.exports = mongoose.model('Club', clubSchema);