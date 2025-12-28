const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    targetMuscle: { type: String, required: true }, // 'chest', 'back', 'legs', 'shoulders', 'cardio'
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
    videoUrl: { type: String, required: true }, // YouTube Embed Linki
    sets: { type: Number, default: 3 }, // Varsayılan set sayısı
    reps: { type: String, default: "10-12" } // Varsayılan tekrar
});

module.exports = mongoose.model('Exercise', exerciseSchema);