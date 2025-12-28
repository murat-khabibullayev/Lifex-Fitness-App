const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Randevuyu alan öğrenci
    className: { type: String, required: true }, // Ders adı (Pilates vs.)
    dayTime: { type: String, required: true },   // Zamanı

    // --- ONAY SİSTEMİ İÇİN ---
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'], // Bekliyor, Onaylandı, Reddedildi
        default: 'pending'
    },
    coachNote: { type: String, default: '' }, // Hocanın notu (Örn: "O saat dolu, 18:00'e aldım")

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', reservationSchema);