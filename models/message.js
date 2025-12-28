const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // Gönderen
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Alıcı
    content: { type: String, required: true }, // Mesaj içeriği
    isRead: { type: Boolean, default: false }, // Okundu mu?
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);