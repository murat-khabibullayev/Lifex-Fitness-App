//KART DÖNDÜRME MANTIĞI
function goToStep2() {
    // Zorunlu alanlar dolu mu kontrol et
    const name = document.getElementById('inpName').value;
    const email = document.getElementById('inpEmail').value;
    const pass = document.getElementById('inpPass').value;

    if (name && email && pass) {
        // Doluysa kartı döndür
        document.getElementById('flipCard').classList.add('hover');
    } else {
        // Boşsa form uyarısını tetikle
        // (Basit bir yöntem: Forma geçici submit butonu ekleyip tıkla, tarayıcı uyarır)
        alert("Lütfen zorunlu alanları doldurun.");
    }
}

function goBackStep1() {
    document.getElementById('flipCard').classList.remove('hover');
}