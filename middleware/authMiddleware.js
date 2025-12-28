// GÜVENLİK KONTROLÜ FONKSİYONU
const loginGerekli = (req, res, next) => {
    // Eğer oturum açılmışsa ve kullanıcı varsa devam et
    if (req.session.user) {
        next();
    } else {
        // Yoksa giriş sayfasına gönder
        res.redirect('/login');
    }
};
module.exports = loginGerekli;