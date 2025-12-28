// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const loginGerekli = require('../middleware/authMiddleware');
const Message = require('../models/message');
const User = require('../models/user');

// 1. MESAJLARI GÖRÜNTÜLEME VE GÖNDERME SAYFASI
router.get('/messages', loginGerekli, async (req, res) => {
    try {
        const userId = req.session.user._id;
        const userRole = req.session.user.role;

        // A) Gelen Mesajları Çek (Bana gelenler)
        const inbox = await Message.find({ receiverId: userId })
            .populate('senderId', 'fullName email') // Gönderenin adını al
            .sort({ createdAt: -1 });

        // B) Giden Mesajları Çek (Benim gönderdiklerim)
        const outbox = await Message.find({ senderId: userId })
            .populate('receiverId', 'fullName') // Alıcının adını al
            .sort({ createdAt: -1 });

        // C) Yeni Mesaj Göndermek İçin Kişi Listesi Hazırla
        let recipients = [];
        if (userRole === 'student') {
            // Öğrenciyse -> Sadece Hocaları görsün
            recipients = await User.find({ role: 'coach' });
        } else if (userRole === 'coach') {
            // Hocaysa -> Tüm Öğrencileri görsün
            recipients = await User.find({ role: 'student' });
        } else if (userRole === 'admin') {
            // Admin -> Tüm kullanıcıları görsün
            recipients = await User.find({ role: { $ne: 'admin' } });
        }

        res.render('messages', {
            page: 'messages',
            inbox: inbox,
            outbox: outbox,
            recipients: recipients,
            user: req.session.user
        });

    } catch (err) {
        res.send("Mesaj hatası: " + err);
    }
});

// 2. MESAJ GÖNDERME İŞLEMİ (POST)
router.post('/messages/send', loginGerekli, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.session.user._id;

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            content: content
        });

        await newMessage.save();

        // Başarılı mesajı (Flash message mantığı eklemiştik)
        req.session.alert = {
            type: 'success',
            message: 'Mesajınız başarıyla gönderildi.'
        };

        res.redirect('/messages');

    } catch (err) {
        res.send("Gönderim hatası: " + err);
    }
});

module.exports = router;