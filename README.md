# LIFEX - AI Destekli Spor Salonu Yönetim ve Takip Sistemi

![Lifex Banner](public/images/home-bg.jpg)

**Lifex**, kullanıcıların fiziksel verilerini analiz ederek kişiye özel sağlık risklerini tahmin eden, dinamik beslenme ve antrenman programları oluşturan, aynı zamanda spor salonu içi operasyonları (rezervasyon, üyelik, hoca-öğrenci takibi) yöneten kapsamlı bir **Web Tabanlı Yönetim Sistemidir (LMS/CRM).**

Bu proje, **Birleşmiş Milletler Sürdürülebilir Kalkınma Amaçları'ndan "3. Sağlık ve Kaliteli Yaşam"** maddesi kapsamında, teknolojinin gücüyle toplum sağlığını iyileştirmek amacıyla geliştirilmiştir.

---

## Proje Özellikleri

### 1. Yapay Zeka Destekli Sağlık Analizi (Data Processing)
*   **Veri Seti Entegrasyonu:** `medicalData.json` veri seti ve DSÖ (WHO) standartları kullanılarak risk analizi.
*   **Risk Tahmini:** Kullanıcının yaşına, kilosuna ve yaşam tarzına göre **Tip 2 Diyabet** ve **Kalp Hastalığı** riskini % bazında hesaplama.
*   **Detaylı Metrikler:** BMI, BMR (Mifflin-St Jeor), TDEE, Vücut Yağ Oranı (US Navy Method) ve İdeal Kilo (Devine Formülü) hesaplamaları.

### 2. Kullanıcı & Öğrenci Modülü
*   **Dinamik Program Oluşturucu:** Veritabanındaki besin ve egzersiz havuzundan, kullanıcının hedefine (Kilo Al/Ver/Koru) uygun **Otomatik Diyet ve Spor Listesi** oluşturma.
*   **Üyelik Sistemi (E-Ticaret):** Kredi kartı simülasyonu ile paket satın alma, aktiflik süresi takibi ve otomatik yetkilendirme (User -> Student geçişi).
*   **Rezervasyon Sistemi:** Grup dersleri için yer ayırtma, iptal etme ve kontenjan takibi.
*   **İletişim:** Eğitmenlerle mesajlaşma ve duyuruları takip etme.

###  3. Eğitmen (Coach) Paneli
*   **Öğrenci Yönetimi:** Kendisine atanan veya sistemdeki öğrencileri listeleme.
*   **Müdahale Yetkisi:** Öğrencinin hedeflerini uzaktan güncelleyebilme ve gelişimini takip etme (Grafiksel analiz).
*   **Randevu Onayı:** Öğrencilerden gelen ders taleplerini onaylama veya reddetme.

### 4. Yönetici (Admin) Paneli & CMS
*   **Dashboard:** Chart.js ile görselleştirilmiş **Ciro Analizi**, **Üye Dağılımı** ve **Paket Tercihleri** grafikleri.
*   **İçerik Yönetimi (CMS):** Kod yazmadan panel üzerinden **Yemek**, **Kampanya** ve **Üyelik Paketi** ekleme/silme/düzenleme.
*   **Personel Yönetimi:** Eğitmen işe alımı ve üye silme işlemleri.
*   **Duyuru Sistemi:** Tüm sisteme veya belirli rollere (Hoca/Öğrenci) toplu bildirim gönderme.

### 5. Teknik Özellikler
*   **Role-Based Access Control (RBAC):** Admin, Coach, Student ve User (Misafir) rolleri için ayrı güvenlik katmanları ve Middleware koruması.
*   **Modern Arayüz:** CSS Glassmorphism (Buzlu Cam) tasarımı, Dark Mode (Gece Modu) desteği ve LocalStorage ile tema hatırlama.
*   **Responsive:** Mobil ve Masaüstü uyumlu Bootstrap 5 ızgara sistemi.

---

## Kullanılan Teknolojiler

| Alan | Teknoloji |
|---|---|
| **Backend** | Node.js, Express.js |
| **Veritabanı** | MongoDB, Mongoose (ODM) |
| **Frontend** | EJS (Template Engine), HTML5, CSS3 |
| **Framework** | Bootstrap 5 |
| **Grafikler** | Chart.js |
| **Oturum** | Express-Session |
| **Dosya Yükleme** | Multer |

---

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1.  **Repoyu Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADIN/Lifex-Fitness-App.git
    cd Lifex-Fitness-App
    ```

2.  **Gerekli Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **MongoDB Bağlantısı:**
    *   Bilgisayarınızda MongoDB'nin kurulu ve çalışır durumda olduğundan emin olun.
    *   `app.js` içerisindeki bağlantı adresi varsayılan olarak `mongodb://127.0.0.1:27017/fitnessApp` şeklindedir.

4.  **Uygulamayı Başlatın:**
    ```bash
    node app.js
    ```

5.  **Veritabanını Doldurma (Seed İşlemi - ÖNEMLİ):**
    Proje ilk açıldığında veritabanı boştur. Aşağıdaki linkleri tarayıcıda **bir kez** çalıştırarak örnek verileri yükleyin:
    *   Yemekler: `http://localhost:3000/seed-tool-foods`
    *   Dersler: `http://localhost:3000/seed-classes`
    *   Paketler: `http://localhost:3000/seed-plans`
    *   Kulüpler: `http://localhost:3000/seed-clubs`
    *   Kampanyalar: `http://localhost:3000/seed-campaigns`
    *   **Admin Oluşturma:** `http://localhost:3000/create-admin` (Giriş: admin@lifex.com / admin)
    *   **Hoca Oluşturma:** `http://localhost:3000/create-coach` (Giriş: hoca@lifex.com / 123)

6.  **Tarayıcıda Açın:**
    `http://localhost:3000` adresine gidin.

---

## Proje Yapısı:
Lifex-Fitness-App/
├── models/ # Veritabanı Şemaları (User, Food, Plan, Reservation...)
├── routes/ # Yönlendirme ve Mantık (Admin, Coach, User, Auth)
├── views/ # EJS Arayüz Dosyaları
│ ├── admin/ # Admin Paneli Sayfaları
│ ├── partials/ # Ortak Parçalar (Navbar, Footer, Sidebar)
│ └── ... # Kullanıcı Sayfaları (Dashboard, Login, Tools...)
├── public/ # Statik Dosyalar
│ ├── css/ # Özel Stil Dosyası (style.css)
│ ├── js/ # Frontend Scriptleri (Chart.js, Tool Motoru)
│ └── images/ # Görseller ve Upload Klasörü
├── middleware/ # Güvenlik Kontrolleri (Auth, Admin, Coach Check)
├── data/ # JSON Veri Setleri
└── app.js # Ana Sunucu Dosyası
---

## Lisans

Bu proje **Web Programlama Dersi** için hazırlanmıştır. Eğitim amaçlıdır.
Tüm Hakları Saklıdır © 2024 Lifex.