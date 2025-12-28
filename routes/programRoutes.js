// routes/programRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Food = require('../models/food');
const Exercise = require('../models/exercise');
const loginGerekli = require('../middleware/authMiddleware');

// YEMEK PROGRAMI OLUŞTUR
router.get('/generate-diet/:id', loginGerekli, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const breakfasts = await Food.find({ type: 'breakfast' });
        const mains = await Food.find({ type: 'main' });
        const snacks = await Food.find({ type: 'snack' });
        const user = await User.findById(userId);

        if (breakfasts.length === 0) return res.send("Yemek verisi yok.");
        if (!user.age || !user.weight || !user.height || !user.gender) {
            return res.redirect('/profile/edit'); // Veri yoksa düzenlemeye at
        }

        const getRandom = (list) => list[Math.floor(Math.random() * list.length)];

        const newPlan = {
            breakfast: getRandom(breakfasts),
            lunch: getRandom(mains),
            dinner: getRandom(mains),
            snack1: getRandom(snacks),
            snack2: getRandom(snacks),
            createdDate: new Date()
        };

        const updatedUser = await User.findByIdAndUpdate(userId, { dietPlan: newPlan }, { new: true });
        req.session.user = updatedUser;
        res.redirect('/my-diet');
    } catch (error) { res.send("Hata: " + error); }
});

// YEMEK PROGRAMINI GÖR
router.get('/my-diet', loginGerekli, (req, res) => {
    const user = req.session.user;
    if (!user.dietPlan || !user.dietPlan.breakfast) return res.redirect(`/generate-diet/${user._id}`);

    let totals = { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 };
    const plan = user.dietPlan;

    ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].forEach(meal => {
        if (plan[meal]) {
            totals.totalCalories += plan[meal].calories || 0;
            totals.totalProtein += plan[meal].protein || 0;
            totals.totalCarbs += plan[meal].carbs || 0;
            totals.totalFat += plan[meal].fat || 0;
        }
    });

    res.render('diet-plan', { user, plan, totals, page: 'diet' });
});

// SPOR PROGRAMI OLUŞTUR
router.get('/generate-workout/:id', loginGerekli, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId); // Güncel user verisi

        const chest = await Exercise.find({ targetMuscle: 'chest' });
        const shoulder = await Exercise.find({ targetMuscle: 'shoulders' });
        const legs = await Exercise.find({ targetMuscle: 'legs' });
        const back = await Exercise.find({ targetMuscle: 'back' });
        const cardio = await Exercise.find({ targetMuscle: 'cardio' });

        if (!user.age || !user.weight || !user.height || !user.gender) {
            return res.redirect('/profile/edit'); // Veri yoksa düzenlemeye at
        }

        let adviceText = "Form koruma için standart tempo.";
        if (user.goal === 'lose') adviceText = "Yağ yakımı için seri setler, az dinlenme.";
        else if (user.goal === 'gain') adviceText = "Kas gelişimi için ağır kilo, uzun dinlenme.";

        const newWorkout = {
            day1: [...chest, ...shoulder],
            day2: [...legs],
            day3: [...back, ...cardio],
            advice: adviceText,
            createdDate: new Date()
        };

        const updatedUser = await User.findByIdAndUpdate(userId, { workoutPlan: newWorkout }, { new: true });
        req.session.user = updatedUser;
        res.redirect('/my-workout');
    } catch (error) { res.send("Hata: " + error); }
});

// SPOR PROGRAMINI GÖR
router.get('/my-workout', loginGerekli, (req, res) => {
    const user = req.session.user;
    if (!user.workoutPlan || !user.workoutPlan.day1 || user.workoutPlan.day1.length === 0) {
        return res.redirect(`/generate-workout/${user._id}`);
    }

    const adviceText = user.workoutPlan.advice || "Standart tempo.";
    res.render('workout-plan', { user, plan: user.workoutPlan, advice: adviceText, page: 'workout' });
});

module.exports = router;