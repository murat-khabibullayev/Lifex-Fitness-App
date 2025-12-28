// models/Food.js
const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Yemeğin adı (Örn: Tavuk Pilav)
    type: { type: String, required: true, enum: ['breakfast', 'main', 'snack'] },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    cholesterol: { type: Number, default: 0 },
    image: String
});

module.exports = mongoose.models.Food || mongoose.model('Food', foodSchema);