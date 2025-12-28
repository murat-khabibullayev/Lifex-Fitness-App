// public/js/admin.js

document.addEventListener("DOMContentLoaded", function () {

    // 1. HTML'den gelen veriyi yakala
    // (Eğer veri yoksa hata vermesin diye kontrol ediyoruz)
    const veri = window.gelenVeri;

    if (veri) {
        // --- GRAFİK 1: PAKET DAĞILIMI (Pasta) ---
        const kutu1 = document.getElementById('planChart');
        if (kutu1) {
            new Chart(kutu1.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: veri.planLabels, // HTML'den gelen etiketler
                    datasets: [{
                        data: veri.planData, // HTML'den gelen sayılar
                        backgroundColor: ['#f1c40f', '#3498db', '#e74c3c', '#9b59b6', '#2ecc71'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // --- GRAFİK 2: KULLANICI DAĞILIMI (Çubuk) ---
        const kutu2 = document.getElementById('userChart');
        if (kutu2) {
            new Chart(kutu2.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: veri.userLabels,
                    datasets: [{
                        label: 'Kişi Sayısı',
                        data: veri.userData,
                        backgroundColor: ['#2ecc71', '#95a5a6', '#f39c12'],
                        borderRadius: 5
                    }]
                },
                options: {
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
        }
    }
});