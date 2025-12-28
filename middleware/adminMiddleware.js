// middleware/adminMiddleware.js

const adminGerekli = (req, res, next) => {
    // 1. Giriş yapmış mı?
    // 2. Rolü 'admin' mi?
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send("<h1>403 - Yetkisiz Erişim!</h1><p>Bu alana sadece yöneticiler girebilir.</p><a href='/'>Ana Sayfaya Dön</a>");
    }
};

module.exports = adminGerekli;