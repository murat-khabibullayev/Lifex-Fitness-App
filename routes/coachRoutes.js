// routes/coachRoutes.js
const express = require('express');
const router = express.Router();
const loginGerekli = require('../middleware/authMiddleware');

// --- HOCA KONTROLÜ (Middleware) ---
// Sadece hocalar girebilsin diye ekstra güvenlik
const hocaGerekli = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'coach') {
        next();
    } else {
        res.send("Bu sayfaya erişim yetkiniz yok (Sadece Hocalar).");
    }
};

// 1. HOCA PANELİ (GÜNCELLENMİŞ - ÖĞRENCİ LİSTESİ İLE)
router.get('/coach-dashboard', loginGerekli, hocaGerekli, async (req, res) => {
    try {
        const User = require('../models/user');
        const Reservation = require('../models/reservation');

        // Onay bekleyen randevular
        const pendingReservations = await Reservation.find({ status: 'pending' })
            .populate('studentId')
            .sort({ createdAt: -1 });

        // SOL MENÜ İÇİN: Tüm öğrencileri çekiyoruz
        const students = await User.find({ role: 'student' }).sort({ fullName: 1 });

        // İstatistikler
        const studentCount = students.length;
        const approvedCount = await Reservation.countDocuments({ status: 'approved' });

        res.render('coach-dashboard', {
            user: req.session.user,
            reservations: pendingReservations,
            students: students, // <-- YENİ EKLENEN (Sol menü için)
            stats: { studentCount, approvedCount },
            page: 'coach-dashboard'
        });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// 2. RANDEVU ONAYLA / REDDET (POST)
router.post('/coach/reservation-action', loginGerekli, hocaGerekli, async (req, res) => {
    try {
        const { reservationId, action, coachNote } = req.body;

        // action: 'approve' veya 'reject'
        const newStatus = (action === 'approve') ? 'approved' : 'rejected';

        await Reservation.findByIdAndUpdate(reservationId, {
            status: newStatus,
            coachNote: coachNote
        });

        res.redirect('/coach-dashboard');
    } catch (err) {
        res.send("İşlem hatası: " + err);
    }
});
// 3. ÖĞRENCİ LİSTESİ VE ANALİZLERİ
router.get('/coach-students', loginGerekli, hocaGerekli, async (req, res) => {
    try {
        const User = require('../models/user');
        let students = await User.find({ role: 'student' }).sort({ fullName: 1 }).lean(); // .lean() ile saf JSON aldık, üzerinde değişiklik yapacağız

        // Her öğrenci için analiz hesapla
        students = students.map(student => {

            // 1. Vücut Yağ Oranı (Navy)
            let bodyFat = 0;
            const { neck, waist, hip } = student.measurements || {};
            if (student.height > 0 && neck > 0 && waist > 0) {
                if (student.gender === 'male') {
                    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(student.height)) - 450;
                } else if (hip > 0) {
                    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(student.height)) - 450;
                }
            }

            // 2. İdeal Kilo (Devine)
            let idealWeight = 0;
            if (student.height > 0) {
                const hInch = student.height / 2.54;
                const base = student.gender === 'male' ? 50 : 45.5;
                idealWeight = base + 2.3 * (hInch - 60);
            }

            // 3. Su İhtiyacı
            const waterNeed = student.weight > 0 ? (student.weight / 30).toFixed(1) : 0;

            // Öğrenci objesine bu verileri ekle
            student.analysis = {
                bodyFat: bodyFat > 0 ? bodyFat.toFixed(1) : '?',
                idealWeight: idealWeight > 0 ? idealWeight.toFixed(1) : '?',
                waterNeed: waterNeed
            };

            return student;
        });

        res.render('coach-students', {
            page: 'coach-students',
            students: students,
            user: req.session.user
        });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// 4. HOCA TARAFINDAN ÖĞRENCİ GÜNCELLEME (POST)
router.post('/coach/update-student', loginGerekli, hocaGerekli, async (req, res) => {
    try {
        // Sadece studentId ve goal alıyoruz. Diğerlerini ellemiyoruz.
        const { studentId, goal } = req.body;
        const User = require('../models/user');

        // Öğrenciyi bul
        const student = await User.findById(studentId);

        // Sadece HEDEFİ güncelle
        student.goal = goal;

        // --- HESAPLAMALARI MEVCUT VERİLERE GÖRE YENİLE ---
        // (Kilo, Boy, Yaş, Aktivite öğrencinin kendi girdiği mevcut değerler kalacak)
        if (student.height > 0 && student.age > 0 && student.weight > 0) {
            let bmr = (student.gender === 'male')
                ? (10 * student.weight) + (6.25 * student.height) - (5 * student.age) + 5
                : (10 * student.weight) + (6.25 * student.height) - (5 * student.age) - 161;

            const tdee = bmr * student.activityLevel; // Mevcut aktivite seviyesi

            let daily = tdee;
            if (student.goal === 'lose') daily -= 500;      // Kilo ver
            else if (student.goal === 'gain') daily += 500; // Kilo al
            // maintain ise daily = tdee kalır

            // Yeni sonuçları kaydet
            student.bmr = Math.round(bmr);
            student.tdee = Math.round(tdee);
            student.dailyCalories = Math.round(daily);
        }
        // -----------------------------

        await student.save();

        // BAŞARI MESAJI (Hocaya gösterilecek)
        req.session.alert = {
            type: 'success',
            message: `✅ ${student.fullName} adlı öğrencinin hedefi güncellendi ve programı yeniden hesaplandı.`
        };

        req.session.save(() => {
            res.redirect('/coach-students');
        });
    } catch (err) {
        res.send("Güncelleme hatası: " + err);
    }
});

module.exports = router;