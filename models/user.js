const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // --- ZORUNLU ALANLAR
    role: {
        type: String,
        enum: ['user', 'student', 'coach', 'admin'],
        default: 'user'
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },

    // --- OPSİYONEL ALANLAR
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    gender: { type: String },
    goal: { type: String },
    activityLevel: { type: Number },

    // --- YENİ DETAYLI ÖLÇÜLER
    measurements: {
        neck: { type: Number, default: 0 },
        chest: { type: Number, default: 0 },
        waist: { type: Number, default: 0 },
        hip: { type: Number, default: 0 }
    },

    // Hesaplanan Değerler
    bmr: { type: Number, default: 0 },
    tdee: { type: Number, default: 0 },
    dailyCalories: { type: Number, default: 0 },

    dietPlan: {
        breakfast: { type: Object },
        lunch: { type: Object },
        dinner: { type: Object },
        snack1: { type: Object },
        snack2: { type: Object },
        createdDate: { type: Date, default: Date.now }
    },
    workoutPlan: {
        day1: { type: Array },
        day2: { type: Array },
        day3: { type: Array },
        advice: { type: String },
        createdDate: { type: Date, default: Date.now }
    },
    membership: {
        isActive: { type: Boolean, default: false },
        planName: String,
        startDate: Date,
        endDate: Date,
        pricePaid: Number
    },
    reservations: [{
        className: String,
        dayTime: String,
        bookedAt: { type: Date, default: Date.now }
    }],
    activeDiscount: {
        type: { type: String, default: null }, // 'kadin' veya 'pesin'
        rate: { type: Number, default: 0 }     // 25 veya 50
    }
}, { timestamps: true });



module.exports = mongoose.models.User || mongoose.model('User', userSchema);