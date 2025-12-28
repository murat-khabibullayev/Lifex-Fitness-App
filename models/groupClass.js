const mongoose = require('mongoose');

const groupClassSchema = new mongoose.Schema({
    urlId: { type: String, required: true, unique: true },
    name: String,
    image: String,
    bgImage: String,
    desc: String,
    info: String,
    schedule: [String]  // Ders saatleri (Bonus özellik)
});

module.exports = mongoose.model('GroupClass', groupClassSchema);