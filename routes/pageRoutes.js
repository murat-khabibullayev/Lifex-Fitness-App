// routes/pageRoutes.js
const express = require('express');
const router = express.Router();
const loginGerekli = require('../middleware/authMiddleware');

// Modelleri Çağırıyoruz (Dosya isimlerine dikkat et)
const User = require('../models/user');
const Club = require('../models/club');
const GroupClass = require('../models/groupClass');
const Plan = require('../models/plan');
const Campaign = require('../models/campaign');
// 1. SEED (VERİ YÜKLEME) ROTALARI

// --- KULÜPLERİ YÜKLE ---
router.get('/seed-clubs', async (req, res) => {
    try {
        await Club.deleteMany({});

        const clubs = [
            {
                name: "Lifex Altunizade",
                city: "İstanbul",
                district: "Üsküdar",
                tags: ["Havuz", "Spa", "Otopark", "Wifi", "Cafe"],
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.1086376807416!2d29.043797775514648!3d41.02287911852648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac81d5bfcea7d%3A0x29e4ef7c40556a8!2s%C4%B0stanbul%20Topkap%C4%B1%20%C3%9Cniversitesi%20Altunizade%20Yerle%C5%9Fkesi!5e0!3m2!1str!2str!4v1766183858478!5m2!1str!2str",
                image: "/images/club-altunizade.jpg",
                address: "Altunizade, Kuşbakışı Cd. No:2, 34662 Üsküdar/İstanbul",
                phone: "0542 120 68 56",
                hours: "Hafta içi: 07:00 - 23:00 / Hafta sonu: 08:00 - 22:00",
                description: "Anadolu yakasının en teknolojik spor kulübü. Geniş ferah alanlar ve son model ekipmanlar.",
                facilities: [
                    { title: "GFX TEKNOLOJİ STÜDYOSU", text: "Nabız kontrollü, yüksek yoğunluklu grup dersleri.", image: "/images/studio.jpg" },
                    { title: "REFORMER PILATES", text: "Aletli pilates stüdyomuzda uzman eğitmenler eşliğinde.", image: "/images/pilates.jpg" },
                    { title: "PREMIUM SPA & SAUNA", text: "Buhar odası ve saunada kaslarını gevşet.", image: "/images/spa.jpg" },
                    { title: "FONKSİYONEL ANTRENMAN", text: "TRX, Kettlebell ve halatlarla donatılmış alan.", image: "/images/fonkAntreman.jpg" }
                ]
            },
            {
                name: "Lifex Kazlıçeşme",
                city: "İstanbul",
                district: "Zeytunburnu",
                tags: ["Spa", "Wifi", "Crossfit"],
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.374057611029!2d28.915033575513228!3d40.99518532023177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7f7b9620421%3A0xfe959152b4ae62cf!2zxLBzdGFuYnVsIFRvcGthcMSxIMOcbml2ZXJzaXRlc2k!5e0!3m2!1str!2str!4v1766165351916!5m2!1str!2str",
                image: "/images/club-kazlicesme.jpg",
                address: "Kazlıçeşme, Prof. Muammer Aksoy Cad. No: 10, 34087 Zeytinburnu/İstanbul",
                phone: "0542 120 68 56",
                hours: "Hafta içi: 06:00 - 23:00 / Hafta sonu: 08:00 - 22:00",
                description: "İstanbul'un en teknolojik spor kulübü.",
                facilities: [
                    { title: "DENİZ MANZARALI KARDİYO", text: "Koşu bantlarında ter atarken boğaz manzarası.", image: "/images/kardio.png" },
                    { title: "CROSSFIT BOX", text: "Olimpik barlar ve geniş istasyonlar.", image: "/images/crossfitBox.jpg" },
                    { title: "LOUNGE & CO-WORKING", text: "Spordan sonra çalışabileceğin alan.", image: "/images/launchbar.jpg" }
                ]
            },
            {
                name: "Lifex Gayrettepe",
                city: "Ankara",
                district: "Şişli",
                tags: ["Havuz", "Otopark", "Basketbol"],
                mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.026777688277!2d29.00732097551707!3d41.068407315721124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab70c85347551%3A0x787b2e0ebb1226ea!2s%C4%B0stanbul%20Topkap%C4%B1%20%C3%9Cniversitesi%20Gayrettepe%20Yerle%C5%9Fkesi!5e0!3m2!1str!2str!4v1766165209258!5m2!1str!2str",
                image: "/images/club-gayrettepe.jpg",
                address: "Dış Kapı, Esentepe, Büyükdere Cd. No: 106, 34394 Şişli/İstanbul",
                phone: "0542 120 68 56",
                hours: "Hafta içi: 07:00 - 23:00 / Hafta sonu: 08:00 - 22:00",
                description: "Şehrin merkezinde kapsamlı spor kompleksi.",
                facilities: [
                    { title: "YARI OLİMPİK KAPALI HAVUZ", text: "5 kulvarlı, hijyenik ve ısıtmalı havuz.", image: "/images/havuz.jpg" },
                    { title: "KAPALI BASKETBOL SAHASI", text: "NBA standartlarında parke zeminli saha.", image: "/images/basketbol.jpg" },
                    { title: "DÖVÜŞ SPORLARI ALANI", text: "Boks ringi ve kum torbaları.", image: "/images/boxingArena.jpg" },
                    { title: "ÜCRETSİZ KAPALI OTOPARK", text: "Üyelerimize özel 3 saat ücretsiz vale.", image: "/images/otopark.jpg" }
                ]
            }
        ];

        await Club.insertMany(clubs);
        res.send("Kulüpler başarıyla yüklendi!");
    } catch (error) {
        res.send("Hata: " + error);
    }
});
// --- KAMPANYALARI YÜKLEME (SEED) ---
router.get('/seed-campaigns', async (req, res) => {
    await Campaign.deleteMany({});

    const campaigns = [
        {
            urlId: 'pesin-odeme-indirimi',
            title: "Peşin Ödemelerde %25 İndirim",
            subtitle: "Yıllık üyeliklerde geçerli dev fırsat!",
            image: "/images/campaign-25.jpg", // Cüzdan/Hesaplama temalı spor fotosu
            description: "Sporu hayatının bir parçası haline getirmeye kararlı mısın? Uzun vadeli hedeflerin için sana destek oluyoruz. Yıllık üyelik paketini peşin al, anında %25 indirim kazan.",
            conditions: [
                "Bu kampanya sadece 'VIP YILLIK' paketi için geçerlidir.",
                "Ödemenin tek seferde kredi kartı veya havale ile yapılması gerekmektedir.",
                "Başka indirimlerle birleştirilemez.",
                "İptal durumunda kullanılan aylar indirimsiz fiyattan hesaplanır."
            ]
        },
        {
            urlId: 'kadin-uyelere-ozel',
            title: "Lifex'te Kadın Üyelere İlk Ay %50 İndirim",
            subtitle: "Daha güçlü yarınlar için harekete geç.",
            image: "/images/campaign-kadin.jpg", // Kadın sporcu fotosu
            description: "Lifex olarak kadınların gücüne inanıyoruz. Spora başlamak isteyen tüm kadın üyelerimize özel, motivasyon olması amacıyla ilk ay üyelik ücretinin yarısı bizden!",
            conditions: [
                "Sadece yeni kadın üyeler için geçerlidir.",
                "En az 3 aylık taahhüt gerektirir.",
                "Grup derslerine katılım dahildir.",
                "Kayıt esnasında kimlik ibrazı zorunludur."
            ]
        }
    ];

    await Campaign.insertMany(campaigns);
    res.send("Kampanyalar yüklendi!");
});

// --- DERSLERİ YÜKLE ---
router.get('/seed-classes', async (req, res) => {
    try {
        await GroupClass.deleteMany({});

        const classes = [
            {
                urlId: 'pilates',
                name: 'Pilates',
                image: '/images/pilates.jpg',
                bgImage: '/images/pilates.jpg',
                desc: 'Esneklik ve denge.',
                info: 'Omurga sağlığı için birebir.',
                schedule: ['Pazartesi 10:00', 'Çarşamba 18:00']
            },
            {
                urlId: 'zumba',
                name: 'Zumba',
                image: '/images/zumba.jpg',
                bgImage: '/images/zumba.jpg',
                desc: 'Dans ederek kalori yak.',
                info: 'Latin müzikleri eşliğinde eğlenceli kardiyo.',
                schedule: ['Salı 19:00', 'Cuma 19:00']
            },
            {
                urlId: 'boxing',
                name: 'Kick Boks',
                image: '/images/boxing.jpg',
                bgImage: '/images/boxing.jpg',
                desc: 'Güç ve kondisyon.',
                info: 'Stres atarken savunma sanatlarını öğrenin.',
                schedule: ['Pazartesi 20:00', 'Perşembe 20:00']
            },
            {
                urlId: 'yoga',
                name: 'Yoga',
                image: '/images/yoga.jpg',
                bgImage: '/images/yoga.jpg',
                desc: 'Zihin ve beden uyumu.',
                info: 'Nefes teknikleri ve esneme.',
                schedule: ['Her Sabah 07:00']
            },
            {
                urlId: 'spinning',
                name: 'Spinning',
                image: '/images/spinning.jpg',
                bgImage: '/images/spinning.jpg',
                desc: 'Yüksek tempo pedal.',
                info: '45 dakikada 600 kalori yakımı.',
                schedule: ['Salı 18:30', 'Perşembe 18:30']
            },
            {
                urlId: 'crossfit',
                name: 'Crossfit',
                image: '/images/crossfit.jpg',
                bgImage: '/images/crossfit.jpg',
                desc: 'Sınırları zorla.',
                info: 'Günün antrenmanı (WOD) ile gücünü test et.',
                schedule: ['Hafta içi Her Akşam 21:00']
            }
        ];

        await GroupClass.insertMany(classes);
        res.send("Grup dersleri yüklendi!");
    } catch (error) {
        res.send("Hata: " + error);
    }
});

// --- PAKETLERİ YÜKLE ---
router.get('/seed-plans', async (req, res) => {
    try {
        await Plan.deleteMany({});

        const plans = [
            {
                name: "BAŞLANGIÇ",
                price: 750,
                durationMonths: 1,
                colorClass: "text-secondary",
                features: ["Sınırsız Giriş", "Temel Program", "Duş & Dolap"],
                isPopular: false
            },
            {
                name: "FIRSAT PAKETİ",
                price: 2000,
                durationMonths: 3,
                colorClass: "text-warning",
                features: ["Tüm Kulüplere Giriş", "Sınırsız Grup Dersi", "Özel Eğitmen Desteği", "Havuz & Spa", "1 Ay Dondurma Hakkı"],
                isPopular: true
            },
            {
                name: "PROFESYONEL",
                price: 3800,
                durationMonths: 6,
                colorClass: "text-info",
                features: ["Tüm İmkanlar Dahil", "Vücut Analizi", "2 Ay Dondurma", "5 Misafir Hakkı"],
                isPopular: false
            },
            {
                name: "VIP YILLIK",
                price: 7000,
                durationMonths: 12,
                colorClass: "text-danger",
                features: ["VIP Soyunma Odası", "Özel Havlu Hizmeti", "Ücretsiz Otopark", "Sınırsız Dondurma", "Hediye Çanta"],
                isPopular: false
            }
        ];

        await Plan.insertMany(plans);
        res.send("Paketler yüklendi!");
    } catch (error) {
        res.send("Hata: " + error);
    }
});

// 2. SAYFA ROTALARI (GET)
// --- KULÜPLER LİSTESİ ---
router.get('/clubs', async (req, res) => {
    try {
        const clubs = await Club.find({});
        res.render('clubs', { page: 'clubs', clubs: clubs });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- KULÜP DETAYI ---
router.get('/clubs/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);
        res.render('club-details', { page: 'clubs', club: club });
    } catch (err) {
        res.send("Kulüp bulunamadı.");
    }
});

// --- DERS LİSTESİ ---
router.get('/classes', async (req, res) => {
    try {
        const classes = await GroupClass.find({});
        res.render('classes', { page: 'classes', classes: classes });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- DERS DETAYI ---
router.get('/classes/:id', async (req, res) => {
    try {
        const classItem = await GroupClass.findOne({ urlId: req.params.id });
        if (classItem) {
            res.render('class-detail', {
                page: 'classes',
                type: classItem.name, // Burası önemli (Title için)
                details: classItem
            });
        } else {
            res.send("Ders bulunamadı.");
        }
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- ÜYELİK SAYFASI ---
router.get('/membership', async (req, res) => {
    try {
        // Eğer linkte ?returnTo=... varsa session'a kaydet (Örn: /classes/pilates)
        if (req.query.returnTo) {
            req.session.returnTo = req.query.returnTo;
        }

        const plans = await Plan.find({});
        res.render('membership', { page: 'membership', plans: plans });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// 2. ÖDEME SAYFASI (GÜNCELLENMİŞ MANTIK)
router.get('/payment/:planId', loginGerekli, async (req, res) => {
    try {
        const user = req.session.user;

        // --- KONTROL 1: ZATEN ÜYE Mİ? ---
        if (user.membership && user.membership.isActive) {
            const today = new Date();
            const endDate = new Date(user.membership.endDate);

            if (today <= endDate) {
                // Flash mesaj ile uyarı verelim
                req.session.alert = {
                    type: 'warning',
                    message: '⚠️ Zaten devam eden bir üyeliğiniz var. Yeni paket alamazsınız.'
                };
                return res.redirect('/my-membership');
            }
        }

        const plan = await Plan.findById(req.params.planId);

        // --- KONTROL 2: İNDİRİM HESAPLAMA (DÜZELTİLDİ) ---
        let finalPrice = plan.price;
        let appliedDiscount = 0;
        let discountMessage = "Merhaba";

        if (user.activeDiscount && user.activeDiscount.rate > 0) {

            // A) KADIN ÜYE KAMPANYASI (Sadece İLK AY %50)
            if (user.activeDiscount.type === 'kadin') {
                // 1 Aylık fiyatı buluyoruz
                const monthlyPrice = plan.price / plan.durationMonths;
                // İndirim miktarı = 1 Aylık fiyatın yarısı
                const discountAmount = monthlyPrice * 0.5;

                finalPrice = plan.price - discountAmount;
                appliedDiscount = 50; // Göstermelik oran (İlk ay için)
                discountMessage = "İlk Ay %50 İndirim Uygulandı!";
            }

            // B) PEŞİN ÖDEME KAMPANYASI (Toplamdan %25 - Sadece Yıllık)
            else if (user.activeDiscount.type === 'pesin') {
                if (plan.name === 'VIP YILLIK') {
                    finalPrice = plan.price - (plan.price * 0.25);
                    appliedDiscount = 25;
                    discountMessage = "%25 Peşin Ödeme İndirimi!";
                }
            }
        }

        res.render('payment', {
            page: 'membership',
            plan: plan,
            finalPrice: Math.round(finalPrice),
            discountRate: appliedDiscount,
            discountMessage: discountMessage // Mesajı sayfaya gönderdik
        });

    } catch (err) {
        res.send("Plan bulunamadı.");
    }
});

// 3. ÖDEME İŞLEMİ (GÜNCELLENMİŞ MANTIK)
router.post('/payment/process', loginGerekli, async (req, res) => {
    try {
        const planId = req.body.planId;
        const plan = await Plan.findById(planId);
        const user = req.session.user; // Veritabanından taze çekmek daha güvenlidir ama session da olur

        // --- İNDİRİMİ BURADA DA HESAPLA (GÜVENLİK İÇİN) ---
        let finalPrice = plan.price;

        if (user.activeDiscount && user.activeDiscount.rate > 0) {

            // A) Kadın İndirimi Mantığı
            if (user.activeDiscount.type === 'kadin') {
                const monthlyPrice = plan.price / plan.durationMonths;
                const discountAmount = monthlyPrice * 0.5;
                finalPrice = plan.price - discountAmount;
            }
            // B) Peşin İndirimi Mantığı
            else if (user.activeDiscount.type === 'pesin' && plan.name === 'VIP YILLIK') {
                finalPrice = plan.price - (plan.price * 0.25);
            }
        }
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + plan.durationMonths);
        const currentUser = await User.findById(user._id);
        let newRole = currentUser.role;
        if (currentUser.role === 'user') {
            newRole = 'student';
        }

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            role: newRole,
            membership: {
                isActive: true,
                planName: plan.name,
                startDate: startDate,
                endDate: endDate,
                pricePaid: Math.round(finalPrice) // Hesaplanan doğru fiyatı kaydet
            },
            // Ödeme yapıldıktan sonra indirim hakkını silebiliriz (İsteğe bağlı)
            activeDiscount: { type: null, rate: 0 }
        }, { new: true });

        req.session.user = updatedUser;

        // Başarı Mesajı
        req.session.alert = {
            type: 'success',
            message: 'Tebrikler! Üyeliğiniz başarıyla başlatıldı.'
        };

        const redirectTo = req.session.returnTo || '/my-membership';
        delete req.session.returnTo;

        res.redirect(redirectTo);

    } catch (err) {
        res.send("Ödeme hatası: " + err);
    }
});

// --- ÜYELİK DURUMU ---
router.get('/my-membership', loginGerekli, (req, res) => {
    const user = req.session.user;
    if (!user.membership || !user.membership.isActive) {
        return res.redirect('/membership');
    }
    res.render('my-membership', { page: 'membership', membership: user.membership });
});

// --- KAMPANYALAR ---
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find({});
        res.render('campaigns', { page: 'campaigns', campaigns: campaigns });
    } catch (err) {
        res.send("Hata: " + err);
    }
});

// --- KAMPANYA DETAYI ---
router.get('/campaigns/:urlId', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ urlId: req.params.urlId });
        if (campaign) {
            res.render('campaign-detail', { page: 'campaigns', campaign: campaign });
        } else {
            res.send("Kampanya bulunamadı.");
        }
    } catch (err) {
        res.send("Hata: " + err);
    }
});
// --- REZERVASYON YAP (YENİ SİSTEM - Reservation Tablosuna) ---
router.post('/reserve', loginGerekli, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        // 1. Üyelik Kontrolü
        if (!user.membership || !user.membership.isActive) {
            return res.redirect('/membership');
        }

        const { className, dayTime } = req.body;

        // 2. YENİ TABLOYA KAYDET (Status: pending olarak)
        // Modeli en üste require ettiğinden emin ol: const Reservation = require('../models/Reservation');
        const Reservation = require('../models/Reservation'); // Garanti olsun diye buraya da yazdım

        const newRes = new Reservation({
            studentId: userId,
            className: className,
            dayTime: dayTime,
            status: 'pending' // Onay bekliyor
        });

        await newRes.save();

        res.redirect('/my-reservations');

    } catch (error) {
        res.send("Hata: " + error);
    }
});
// --- REZERVASYONLARIM SAYFASI (GET) ---
router.get('/my-reservations', loginGerekli, async (req, res) => {
    try {
        const Reservation = require('../models/Reservation'); // Modeli çağır
        const userId = req.session.user._id;

        // Öğrencinin ID'sine sahip tüm rezervasyonları bul (Yeniden eskiye)
        const myReservations = await Reservation.find({ studentId: userId }).sort({ createdAt: -1 });

        res.render('my-reservations', {
            page: 'reservations',
            reservations: myReservations
        });
    } catch (error) {
        res.send("Hata: " + error);
    }
});
// --- REZERVASYON İPTAL (YENİ TABLOYA GÖRE) ---
router.post('/cancel-reservation', loginGerekli, async (req, res) => {
    try {
        const Reservation = require('../models/Reservation');
        const { reservationId } = req.body;

        // Direkt rezervasyon tablosundan sil
        await Reservation.findByIdAndDelete(reservationId);

        res.redirect('/my-reservations');
    } catch (error) {
        res.send("İptal hatası: " + error);
    }
});
// --- KAMPANYA İNDİRİMİNİ UYGULA (POST) ---
router.post('/apply-discount', loginGerekli, async (req, res) => {
    try {
        const { campaignType } = req.body;
        const user = await User.findById(req.session.user._id);
        let discountRate = 0;
        let discountType = null;

        // 1. KADIN ÜYE KAMPANYASI KONTROLÜ
        if (campaignType === 'kadin-uyelere-ozel') {
            if (user.gender === 'female') {
                discountRate = 50;
                discountType = 'kadin';
            } else {
                // Eğer erkekse hata mesajı ile geri gönder (Flash message yoksa alert ile)
                return res.send('<script>alert("Bu kampanya sadece kadın üyelerimiz için geçerlidir."); window.location.href="/campaigns";</script>');
            }
        }

        // 2. PEŞİN ÖDEME KAMPANYASI
        else if (campaignType === 'pesin-odeme-indirimi') {
            discountRate = 25;
            discountType = 'pesin';
        }

        // Veritabanına İndirimi Kaydet
        user.activeDiscount = {
            type: discountType,
            rate: discountRate
        };
        await user.save();

        // Session'ı güncelle
        req.session.user = user;

        // Başarılı, şimdi paket seçmeye gitsin
        res.redirect('/membership');

    } catch (error) {
        res.send("Hata: " + error);
    }
});
// --- HESAPLAMA ARAÇLARI (HERKESE AÇIK) ---
router.get('/tools', (req, res) => {
    // User verisini gönderiyoruz ki navbar düzgün çalışsın (Giriş yaptıysa ismini göstersin)
    res.render('tools', {
        page: 'tools',
        user: req.session.user || null
    });
});
// --- API: CANLI YEMEK ARAMA (JSON DÖNER) ---
router.get('/api/search-food', async (req, res) => {
    try {
        const query = req.query.q; // ?q=elma gibi gelen veri
        if (!query) return res.json([]);

        // Veritabanında isme göre ara (Büyük/küçük harf duyarsız - regex)
        const foods = await require('../models/food').find({
            name: { $regex: query, $options: 'i' }
        }).limit(10); // En fazla 10 sonuç getir

        res.json(foods); // Sonuçları JSON formatında gönder
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ======================================================
// 6. DESTEK VE HATA BİLDİRİMİ
// ======================================================

// --- DESTEK SAYFASI (GET) ---
router.get('/support', loginGerekli, (req, res) => {
    res.render('support', { page: 'support', user: req.session.user });
});

// --- DESTEK TALEBİ GÖNDER (POST) ---
router.post('/support/send', loginGerekli, async (req, res) => {
    try {
        const { subject, message } = req.body;
        const User = require('../models/User');
        const Message = require('../models/Message');

        // 1. Sistemdeki Admini Bul
        const admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            return res.send("Sistemde yönetici bulunamadı, lütfen daha sonra deneyin.");
        }

        // 2. Admin'e Mesaj Olarak Kaydet
        const newTicket = new Message({
            senderId: req.session.user._id,
            receiverId: admin._id,
            content: `[DESTEK - ${subject}] \n\n${message}`,
            isRead: false
        });

        await newTicket.save();

        // 3. Başarı Mesajı
        req.session.alert = {
            type: 'success',
            message: '✅ Destek talebiniz yöneticiye iletildi. En kısa sürede dönüş yapılacaktır.'
        };

        res.redirect('/support');

    } catch (err) {
        res.send("Hata: " + err);
    }
});
module.exports = router;