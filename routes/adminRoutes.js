// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const loginGerekli = require('../middleware/authMiddleware'); // Giriş yapmış mı?
const adminGerekli = require('../middleware/adminMiddleware'); // Admin mi?
const User = require('../models/user');
const Reservation = require('../models/reservation');
const Food = require('../models/food');
const Campaign = require('../models/campaign');
const Plan = require('../models/plan');

// 1. ADMIN DASHBOARD (GRAFİKLİ & DETAYLI)
router.get('/admin/dashboard', loginGerekli, adminGerekli, async (req, res) => {
    try {
        // --- TEMEL SAYAÇLAR ---
        const studentCount = await User.countDocuments({ role: 'student' });
        const coachCount = await User.countDocuments({ role: 'coach' });
        const userCount = await User.countDocuments({ role: 'user' });

        // --- TOPLAM KAZANÇ ---
        const incomeData = await User.aggregate([
            { $match: { role: 'student' } },
            { $group: { _id: null, total: { $sum: "$membership.pricePaid" } } }
        ]);
        const totalIncome = incomeData.length > 0 ? incomeData[0].total : 0;

        // --- SON REZERVASYONLAR ---
        const recentReservations = await Reservation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('studentId', 'fullName');

        // --- GRAFİK 1: ÜYELİK PAKETİ DAĞILIMI (Hangi paket kaç kişi?) ---
        const planStats = await User.aggregate([
            { $match: { role: 'student', 'membership.isActive': true } },
            { $group: { _id: "$membership.planName", count: { $sum: 1 } } }
        ]);
        // Veriyi grafik formatına çevirelim (Label ve Data dizileri)
        // Veri boşsa bile boş dizi [] gönderelim
        const planLabels = planStats.length > 0 ? planStats.map(p => p._id || 'Bilinmeyen') : [];
        const planData = planStats.length > 0 ? planStats.map(p => p.count) : [];
        // --- GRAFİK 2: KULLANICI TİPİ DAĞILIMI ---
        const userLabels = ['Aktif Öğrenci', 'Potansiyel Üye', 'Eğitmen'];
        const userData = [studentCount, userCount, coachCount];

        res.render('admin/dashboard', {
            user: req.session.user,
            page: 'admin-dashboard',
            stats: { studentCount, coachCount, userCount, totalIncome },
            recentReservations,
            // Grafikler için verileri gönderiyoruz
            charts: {
                planLabels: JSON.stringify(planLabels),
                planData: JSON.stringify(planData),
                userLabels: JSON.stringify(userLabels),
                userData: JSON.stringify(userData)
            }
        });
    } catch (err) {
        res.send("Admin paneli hatası: " + err);
    }
});
// ======================================================
// 2. EĞİTMEN YÖNETİMİ
// ======================================================

// --- HOCA LİSTESİ (GET) ---
router.get('/admin/coaches', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const coaches = await User.find({ role: 'coach' }).sort({ createdAt: -1 });
        res.render('admin/coaches', {
            page: 'admin-coaches',
            user: req.session.user,
            coaches: coaches
        });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- YENİ HOCA EKLE (POST) ---
router.post('/admin/coaches/add', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // E-posta kontrolü (Zaten var mı?)
        const existing = await User.findOne({ email: email });
        if (existing) return res.send("Bu e-posta adresi zaten kayıtlı.");

        const newCoach = new User({
            fullName: fullName,
            email: email,
            password: password,
            role: 'coach', // ÖNEMLİ: Rolü Hoca yapıyoruz
            // Varsayılan değerler (Hoca sonra profilinden düzenler)
            gender: 'male', age: 30, height: 180, weight: 80
        });

        await newCoach.save();
        res.redirect('/admin/coaches');

    } catch (err) {
        res.send("Ekleme hatası: " + err);
    }
});

// --- HOCA SİL (POST) ---
router.post('/admin/coaches/delete', loginGerekli, adminGerekli, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.coachId);
        res.redirect('/admin/coaches');
    } catch (err) {
        res.send("Silme hatası: " + err);
    }
});
// ======================================================
// 3. ÖĞRENCİ YÖNETİMİ
// ======================================================

// --- ÖĞRENCİ LİSTESİ (GET) ---
router.get('/admin/students', loginGerekli, adminGerekli, async (req, res) => {
    try {
        // Rolü 'student' veya 'user' olanları getir (Admin ve Coach hariç)
        const students = await User.find({ role: { $in: ['student', 'user'] } }).sort({ createdAt: -1 });

        res.render('admin/students', {
            page: 'admin-students',
            user: req.session.user,
            students: students
        });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- ÖĞRENCİ SİL (POST) ---
router.post('/admin/students/delete', loginGerekli, adminGerekli, async (req, res) => {
    try {
        // Öğrenciyi silerken ona ait rezervasyonları da silmek temiz iş olur (İsteğe bağlı)
        const studentId = req.body.studentId;

        await User.findByIdAndDelete(studentId);

        // Ekstra temizlik: Bu öğrenciye ait rezervasyonları da siliyoruz
        await Reservation.deleteMany({ studentId: studentId });

        res.redirect('/admin/students');
    } catch (err) {
        res.send("Silme hatası: " + err);
    }
});
// ======================================================
// 4. İÇERİK YÖNETİMİ (YEMEK & KAMPANYA)
// ======================================================

// --- İÇERİK SAYFASI (GÜNCELLENMİŞ) ---
router.get('/admin/content', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const foods = await Food.find({}).sort({ name: 1 });
        const campaigns = await Campaign.find({});
        const plans = await Plan.find({}).sort({ price: 1 }); // Fiyata göre sırala

        res.render('admin/content', {
            page: 'admin-content',
            user: req.session.user,
            foods: foods,
            campaigns: campaigns,
            plans: plans // <-- YENİ EKLENEN
        });
    } catch (err) {
        res.send("Hata: " + err);
    }
});
// --- YEMEK EKLE (POST) ---
router.post('/admin/food/add', loginGerekli, adminGerekli, async (req, res) => {
    try {
        // Formdan gelen veriler
        const { name, type, calories, protein, carbs, fat, fiber, sugar, image } = req.body;

        const newFood = new Food({
            name, type,
            calories: Number(calories),
            protein: Number(protein),
            carbs: Number(carbs),
            fat: Number(fat),
            fiber: Number(fiber),
            sugar: Number(sugar),
            image: image || 'https://via.placeholder.com/100' // Resim yoksa boş kutu koy
        });

        await newFood.save();
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Yemek ekleme hatası: " + err);
    }
});

// --- YEMEK SİL (POST) ---
router.post('/admin/food/delete', loginGerekli, adminGerekli, async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.body.foodId);
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Silme hatası: " + err);
    }
});

// --- KAMPANYA EKLE (POST) ---
router.post('/admin/campaign/add', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const { title, subtitle, description, conditions, image } = req.body;

        // URL ID oluştur (Başlığı küçült, boşlukları tire yap)
        // Örn: "Büyük Yaz İndirimi" -> "buyuk-yaz-indirimi"
        const urlId = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // Koşulları virgülle ayırarak diziye çevir
        const conditionsArray = conditions.split(',').map(item => item.trim());

        const newCampaign = new Campaign({
            urlId, title, subtitle, description, image,
            conditions: conditionsArray
        });

        await newCampaign.save();
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Kampanya ekleme hatası: " + err);
    }
});

// --- KAMPANYA SİL (POST) ---
router.post('/admin/campaign/delete', loginGerekli, adminGerekli, async (req, res) => {
    try {
        await Campaign.findByIdAndDelete(req.body.campaignId);
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Silme hatası: " + err);
    }
});
// --- DUYURU GÖNDERME (POST) ---
router.post('/admin/send-announcement', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const { targetAudience, title, message } = req.body;
        const Message = require('../models/Message');

        let query = {};

        // Kitleyi Seç
        if (targetAudience === 'coaches') {
            query = { role: 'coach' };
        } else if (targetAudience === 'students') {
            query = { role: 'student' };
        } else {
            // Herkes (Admin hariç)
            query = { role: { $ne: 'admin' } };
        }

        // Seçilen kişileri bul
        const recipients = await User.find(query);

        // Herkese tek tek mesaj oluştur (Bulk Insert daha iyi ama şimdilik döngü yeterli)
        const messagesToSend = recipients.map(user => ({
            senderId: req.session.user._id,
            receiverId: user._id,
            content: `[DUYURU: ${title}] \n\n ${message}`,
            isRead: false,
            createdAt: new Date()
        }));

        await Message.insertMany(messagesToSend);

        // Flash mesaj (varsa)
        // req.session.alert = { type: 'success', message: 'Duyuru başarıyla gönderildi.' };

        res.redirect('/admin/dashboard');

    } catch (err) {
        res.send("Duyuru hatası: " + err);
    }
});
// --- ÜYELİK PAKETİ EKLE (POST) ---
router.post('/admin/plan/add', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const { name, price, durationMonths, features, colorClass, isPopular } = req.body;

        // Özellikleri virgülle ayırıp diziye çevir
        const featuresArray = features.split(',').map(item => item.trim());

        const newPlan = new Plan({
            name,
            price: Number(price),
            durationMonths: Number(durationMonths),
            features: featuresArray,
            colorClass: colorClass || 'text-white',
            isPopular: isPopular === 'on' // Checkbox işaretliyse true olur
        });

        await newPlan.save();
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Paket ekleme hatası: " + err);
    }
});

// --- ÜYELİK PAKETİ SİL (POST) ---
router.post('/admin/plan/delete', loginGerekli, adminGerekli, async (req, res) => {
    try {
        await Plan.findByIdAndDelete(req.body.planId);
        res.redirect('/admin/content');
    } catch (err) {
        res.send("Silme hatası: " + err);
    }
});
// --- ÜYELİK PAKETİ GÜNCELLE (POST) ---
router.post('/admin/plan/update', loginGerekli, adminGerekli, async (req, res) => {
    try {
        const { planId, name, price, durationMonths, features, colorClass, isPopular } = req.body;

        // Özellikleri tekrar diziye çevir
        const featuresArray = features.split(',').map(item => item.trim());

        await Plan.findByIdAndUpdate(planId, {
            name,
            price: Number(price),
            durationMonths: Number(durationMonths),
            features: featuresArray,
            colorClass,
            isPopular: isPopular === 'on'
        });

        res.redirect('/admin/content');
    } catch (err) {
        res.send("Güncelleme hatası: " + err);
    }
});

module.exports = router;