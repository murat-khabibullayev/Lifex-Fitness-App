// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Model yoluna dikkat (../)

// GİRİŞ SAYFASI
router.get('/login', (req, res) => {
    // Eğer linkte ?returnTo=... varsa, bunu session'a kaydet
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render('login', { user: null, returnTo: req.query.returnTo });
});

// GİRİŞ İŞLEMİ (POST)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.send('<script>alert("Kullanıcı bulunamadı!"); window.location.href="/login";</script>');
        }

        if (user.password === password) {
            req.session.user = user;

            // --- YENİ YÖNLENDİRME MANTIĞI ---
            let hedefLink = `/dashboard/${user._id}`; // Varsayılan: Öğrenci Paneli

            if (user.role === 'admin') {
                hedefLink = '/admin/dashboard'; // Admin ise buraya
            }

            if (user.role === 'coach') {
                hedefLink = '/coach-dashboard'; // Hoca ise Hoca Paneline
            }
            else if (req.session.returnTo) {
                hedefLink = req.session.returnTo; // Yarım kalan işlem varsa oraya
                delete req.session.returnTo;
            }
            res.redirect(hedefLink);
        } else {
            res.send('<script>alert("Şifre hatalı!"); window.location.href="/login";</script>');
        }
    } catch (error) {
        res.send("Hata: " + error);
    }
});

// KAYIT SAYFASI
router.get('/register', (req, res) => {
    // Eğer linkte ?returnTo=... varsa, bunu session'a kaydet
    if (req.query.returnTo) {
        req.session.returnTo = req.query.returnTo;
    }
    res.render('register', { user: null, returnTo: req.query.returnTo });
});
// KAYIT İŞLEMİ (POST)
router.post('/register', async (req, res) => {
    try {
        const {
            fullName, email, password,
            // Opsiyonel veriler (varsayılan değer atamak için boş gelebilirler)
            age, height, weight, gender, goal, activityLevel,
            neck, chest, waist, hip
        } = req.body;

        // Sayısal değerleri kontrol et (Boşsa 0 kabul etsin)
        const w = weight ? parseFloat(weight) : 0;
        const h = height ? parseFloat(height) : 0;
        const a = age ? parseFloat(age) : 0;
        const act = activityLevel ? parseFloat(activityLevel) : 1.2;

        // BMR ve TDEE Hesaplama (Sadece boy ve kilo girildiyse çalışsın)
        let bmrCalc = 0;
        let tdeeCalc = 0;
        let daily = 0;

        if (w > 0 && h > 0 && a > 0) {
            bmrCalc = (gender === 'male')
                ? (10 * w) + (6.25 * h) - (5 * a) + 5
                : (10 * w) + (6.25 * h) - (5 * a) - 161;

            tdeeCalc = bmrCalc * act;

            daily = tdeeCalc;
            if (goal === 'lose') daily -= 500;
            else if (goal === 'gain') daily += 500;
        }

        const newUser = new User({
            role: 'user',
            fullName, email, password,
            age: a, height: h, weight: w,
            gender: gender || null,
            goal: goal || null,
            activityLevel: act || null,
            // Yeni Ölçümler
            measurements: {
                neck: neck ? parseFloat(neck) : 0,
                chest: chest ? parseFloat(chest) : 0,
                waist: waist ? parseFloat(waist) : 0,
                hip: hip ? parseFloat(hip) : 0
            },
            // Hesaplananlar
            bmr: Math.round(bmrCalc),
            tdee: Math.round(tdeeCalc),
            dailyCalories: Math.round(daily)
        });

        await newUser.save();

        req.session.user = newUser;

        // Akıllı Yönlendirme
        const redirectTo = req.session.returnTo || `/dashboard/${newUser._id}`;
        delete req.session.returnTo;
        res.redirect(redirectTo);

    } catch (error) {
        console.log(error);
        res.send("Kayıt hatası: " + error.message);
    }
});

// ÇIKIŞ İŞLEMİ
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
// --- GEÇİCİ: ADMİN HESABI OLUŞTURMA ---
router.get('/create-admin', async (req, res) => {
    try {
        // Zaten var mı kontrol et
        const existingAdmin = await User.findOne({ email: 'admin@lifex.com' });
        if (existingAdmin) return res.send("Admin zaten var: admin@lifex.com / admin123");

        const newAdmin = new User({
            fullName: "Süper Admin",
            email: "admin@lifex.com",
            password: "admin", // Güçlü şifre koymak gerekir normalde
            role: "admin",     // İŞTE SİHİRLİ KELİME
            gender: "male",
            age: 30,
            height: 180,
            weight: 80
        });

        await newAdmin.save();
        res.send("Admin oluşturuldu! <br> Email: admin@lifex.com <br> Şifre: admin");
    } catch (error) {
        res.send("Hata: " + error);
    }
});

module.exports = router;