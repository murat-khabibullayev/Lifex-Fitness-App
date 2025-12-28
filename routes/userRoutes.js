// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const loginGerekli = require('../middleware/authMiddleware'); // Middleware'i çağırdık
const fs = require('fs'); // Dosya okumak için
const path = require('path');
const multer = require('multer');

// DASHBOARD
// --- DASHBOARD (GÜNCELLENMİŞ - SAĞLIK ANALİZİ İLE) ---
// routes/userRoutes.js - GÜNCELLENMİŞ DASHBOARD ROTASI

const uploadDir = 'public/images/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads/') // Dosyanın kaydedileceği yer
    },
    filename: function (req, file, cb) {
        // Dosya adı çakışmasın diye tarih ekliyoruz
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.get('/dashboard/:id', loginGerekli, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // --- 1. SAĞLIK VERİ SETİNİ OKU ---
        const fs = require('fs');
        const path = require('path');
        // Hata önlemek için try-catch bloğu içinde okuyalım veya dosya yoksa boş obje dönelim
        let medicalData = { bmi_ranges: [], disease_risks: { diabetes: {}, heart_disease: {} } };
        try {
            const rawData = fs.readFileSync(path.join(__dirname, '../data/medicalData.json'));
            medicalData = JSON.parse(rawData);
        } catch (e) { console.log("Veri seti okunamadı, varsayılanlar kullanılacak."); }

        // --- 2. HESAPLAMALAR ---

        // A) BMI (Vücut Kitle İndeksi)
        const hMeters = user.height / 100;
        const bmi = (user.height > 0 && user.weight > 0) ? (user.weight / (hMeters * hMeters)).toFixed(1) : 0;

        // BMI Durumu
        let bmiStatus = "Veri Yok";
        let riskFactor = 0;
        if (medicalData.bmi_ranges) {
            for (let range of medicalData.bmi_ranges) {
                if (bmi >= range.min && bmi < range.max) {
                    bmiStatus = range.status;
                    riskFactor = range.riskFactor;
                    break;
                }
            }
        }

        // B) Vücut Yağ Oranı (Navy Method) - GÜNCELLENMİŞ
        let bodyFat = 0;

        // Veritabanından gelen ölçüleri güvenli bir şekilde al
        const neck = user.measurements ? Number(user.measurements.neck) : 0;
        const waist = user.measurements ? Number(user.measurements.waist) : 0;
        const hip = user.measurements ? Number(user.measurements.hip) : 0;
        const height = Number(user.height);

        // Hesaplama (Boyun ve Bel ŞARTTIR)
        if (height > 0 && neck > 0 && waist > 0) {
            if (user.gender === 'male') {
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            } else if (hip > 0) { // Kadın için kalça da şart
                bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
            }
        }
        // Sonuç eksi veya saçma çıkarsa 0 yap
        bodyFat = (bodyFat > 0 && bodyFat < 60) ? bodyFat.toFixed(1) : 0;

        // C) İdeal Kilo (Devine Formülü)
        let idealWeight = 0;
        if (user.height > 0) {
            const heightInInches = user.height / 2.54;
            const base = user.gender === 'male' ? 50 : 45.5;
            idealWeight = base + 2.3 * (heightInInches - 60);
        }
        idealWeight = idealWeight > 0 ? idealWeight.toFixed(1) : 0;

        // D) Su İhtiyacı (Kilo / 30)
        const waterNeed = user.weight > 0 ? (user.weight / 30).toFixed(1) : 0;

        // E) Hastalık Riski (Önceki kodun aynısı)
        let diabetesRisk = 0;
        let heartRisk = 0;

        // Sadece BMI hesaplanabilmişse (yani boy ve kilo varsa) ve yaş varsa risk hesapla
        if (bmi > 0 && user.age > 0) {
            // Diyabet
            diabetesRisk = 5 + (user.age * 0.5);
            if (bmi > 25) diabetesRisk += 20;
            if (user.activityLevel && user.activityLevel < 1.4) diabetesRisk += 10;

            // Kalp
            heartRisk = 3 + (user.age * 0.8);
            if (bmi > 30) heartRisk += 25;
            if (user.activityLevel && user.activityLevel < 1.4) heartRisk += 15;

            // Sınırlandırma
            diabetesRisk = Math.min(Math.round(diabetesRisk), 99);
            heartRisk = Math.min(Math.round(heartRisk), 99);
        }
        // Veri Paketi
        const analysis = {
            bmi: bmi,
            status: bmiStatus,
            riskFactor: riskFactor,
            bodyFat: bodyFat,       // Yeni
            idealWeight: idealWeight, // Yeni
            waterNeed: waterNeed,   // Yeni
            diabetesRisk: Math.min(Math.round(diabetesRisk), 99),
            heartRisk: Math.min(Math.round(heartRisk), 99)
        };

        res.render('dashboard', {
            user: user,
            page: 'dashboard',
            analysis: analysis
        });

    } catch (err) {
        console.log(err);
        res.send("Dashboard hatası: " + err.message);
    }
});

// PROFİL GÖRÜNTÜLEME
router.get('/profile', loginGerekli, (req, res) => {
    res.render('profile', { user: req.session.user, page: 'profile' });
});

// PROFİL DÜZENLEME FORMU
router.get('/edit-profile', loginGerekli, (req, res) => {
    res.render('edit-profile', { user: req.session.user, page: 'profile' });
});

//AYARLAR SAYFASI
router.get('/settings', loginGerekli, (req, res) => {
    res.render('settings', { user: req.session.user, page: 'settings' });
});

// PROFİL GÜNCELLEME (POST)
// --- PROFİL GÜNCELLEME (RESİM DESTEKLİ) ---
// upload.single('profileImage') -> Formdan gelen dosya inputunun adı 'profileImage' olmalı
router.post('/settings/update', loginGerekli, upload.single('profileImage'), async (req, res) => {
    try {
        const {
            fullName, age, height, weight, gender, goal, activityLevel,
            neck, waist, hip, chest
        } = req.body;

        const userId = req.session.user._id;
        const User = require('../models/User'); // Model burada lazım

        // Mevcut kullanıcıyı bul
        const currentUser = await User.findById(userId);

        // ... (BMR ve Kalori hesaplama kodları AYNEN KALSIN, burayı silme) ...
        const w = parseFloat(weight) || 0;
        const h = parseFloat(height) || 0;
        const a = parseFloat(age) || 0;
        const act = parseFloat(activityLevel) || 1.2;

        let bmrCalc = 0;
        if (w > 0 && h > 0 && a > 0) {
            bmrCalc = (gender === 'male')
                ? (10 * w) + (6.25 * h) - (5 * a) + 5
                : (10 * w) + (6.25 * h) - (5 * a) - 161;
        }
        const tdeeCalc = bmrCalc * act;
        let daily = tdeeCalc;
        if (goal === 'lose') daily -= 500;
        else if (goal === 'gain') daily += 500;
        // ------------------------------------------------------------------

        // GÜNCELLEME OBJESİ
        const updateData = {
            fullName, age: a, height: h, weight: w, gender, goal, activityLevel,
            measurements: {
                neck: parseFloat(neck) || 0,
                waist: parseFloat(waist) || 0,
                hip: parseFloat(hip) || 0,
                chest: parseFloat(chest) || 0
            },
            bmr: Math.round(bmrCalc),
            tdee: Math.round(tdeeCalc),
            dailyCalories: Math.round(daily)
        };

        // EĞER YENİ RESİM YÜKLENDİYSE ONU DA EKLE
        if (req.file) {
            updateData.profileImage = '/images/uploads/' + req.file.filename;
        }

        // Veritabanını Güncelle
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        // Session'ı Güncelle
        req.session.user = updatedUser;

        req.session.alert = { type: 'success', message: '✅ Profil başarıyla güncellendi.' };
        res.redirect(`/dashboard/${updatedUser._id}`);

    } catch (error) {
        res.send("Güncelleme hatası: " + error);
    }
});

//HESAP SİLME
router.post('/settings/delete', loginGerekli, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.user._id);
        req.session.destroy(() => res.redirect('/'));
    } catch (error) {
        req.session.alert = {
            type: 'error',
            message: 'Bir hata oluştu: ' + error
        };
        res.redirect(`/dashboard/${req.session.user._id}`);
    }
});

module.exports = router;