// app.js (MODÜLER YAPI)

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const pageRoutes = require('./routes/pageRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route Dosyalarını Çağırıyoruz
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const coachRoutes = require('./routes/coachRoutes');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
//AYARLAR
app.use(session({
    secret: 'lifex-proje-sifresi',
    resave: false,
    saveUninitialized: false
}));

app.use(adminRoutes);


// 2. FLASH MESSAGE & USER MIDDLEWARE (Rotalardan ÖNCE olmalı!)
// Bu kodu kopyala ve mevcut olanın yerine yapıştır:

//GLOBAL DEĞİŞKENLER (Her view'da user erişimi için)
app.use((req, res, next) => {
    res.locals.user = req.session.user;

    // Eğer session'da bir mesaj varsa onu sayfaya gönder ve sil
    res.locals.alert = req.session.alert;
    delete req.session.alert;

    next();
});

app.use(coachRoutes);
app.use(messageRoutes);

//VERİTABANI BAĞLANTISI
mongoose.connect('mongodb://127.0.0.1:27017/fitnessApp')
    .then(() => console.log('MongoDB Bağlantısı Başarılı!'))
    .catch((err) => console.log('MongoDB Hatası:', err));



//ROUTES
// Ana Sayfa (Tek başına olduğu için burada bıraktım)
app.get('/', (req, res) => {
    res.render('index', { user: req.session.user, page: 'home' });
});

// Diğer Rotaları Kullan
app.use(authRoutes);    // Giriş, Kayıt
app.use(userRoutes);    // Dashboard, Profil, Ayarlar
app.use(programRoutes); // Yemek, Spor
app.use(pageRoutes);    // Sayfalar

//SUNUCUYU BAŞLAT
app.listen(3000, () => {
    console.log('Sunucu çalışıyor: http://localhost:3000');
});