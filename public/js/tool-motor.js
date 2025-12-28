// --- 1. BESİN ARAMA MOTORU ---
const foodInput = document.getElementById('foodSearchInput');
const searchResults = document.getElementById('foodSearchResults');
const resultArea = document.getElementById('foodResultArea');

if (foodInput) {
    foodInput.addEventListener('input', async function () {
        const query = this.value;
        if (query.length < 2) {
            searchResults.classList.add('d-none');
            return;
        }

        // Backend API'ye bağlan
        const res = await fetch(`/api/search-food?q=${query}`);
        const foods = await res.json();

        searchResults.innerHTML = '';

        if (foods.length > 0) {
            searchResults.classList.remove('d-none');
            foods.forEach(food => {
                const li = document.createElement('li');
                li.innerText = food.name;
                li.onclick = () => showFoodDetails(food);
                searchResults.appendChild(li);
            });
        } else {
            searchResults.classList.add('d-none');
        }
    });
}

function showFoodDetails(food) {
    searchResults.classList.add('d-none');
    foodInput.value = food.name;
    resultArea.classList.remove('d-none');

    // Temel Bilgiler
    document.getElementById('foodName').innerText = food.name;
    document.getElementById('foodKcal').innerText = food.calories;
    document.getElementById('foodCarb').innerText = food.carbs;
    document.getElementById('foodProt').innerText = food.protein;
    document.getElementById('foodFat').innerText = food.fat;

    // Detay Tablosu (Veritabanında yoksa 0 göster)
    document.getElementById('foodFiber').innerText = (food.fiber || 0) + ' g';
    document.getElementById('foodSugar').innerText = (food.sugar || 0) + ' g';
    document.getElementById('foodChol').innerText = (food.cholesterol || 0) + ' mg';

    // Resim (Varsa kullan, yoksa placeholder)
    const imgEl = document.getElementById('foodImage');
    imgEl.src = food.image ? food.image : 'https://via.placeholder.com/100?text=Resim+Yok';

    // Daire Grafik Rengi (Conic Gradient)
    const total = food.carbs + food.protein + food.fat;
    const cP = (food.carbs / total) * 100;
    const pP = (food.protein / total) * 100;

    const circle = document.getElementById('calorieCircle');
    circle.style.background = `conic-gradient(
        #198754 0% ${cP}%, 
        #dc3545 ${cP}% ${cP + pP}%, 
        #ffc107 ${cP + pP}% 100%
    )`;
}

// --- 2. VÜCUT TİPİ HESAPLAMA ---
function calcBodyType() {
    const bust = parseFloat(document.getElementById('btBust').value);
    const waist = parseFloat(document.getElementById('btWaist').value);
    const hip = parseFloat(document.getElementById('btHip').value);
    let result = "Lütfen ölçüleri giriniz.";

    if (bust && waist && hip) {
        if ((bust - hip) <= 2 && (hip - bust) < 10 && (bust - waist) >= 20) result = "Kum Saati";
        else if ((hip - bust) >= 10) result = "Armut Tipi";
        else if ((bust - hip) >= 10) result = "Elma / Ters Üçgen";
        else result = "Dikdörtgen";

        document.getElementById('btValue').innerText = result;
        document.getElementById('btResult').classList.remove('d-none');
    }
}

// --- 3. VÜCUT YAĞ ORANI (US Navy Method) ---
// Kadın seçilince kalça kutusunu aç
const bfGender = document.getElementById('bfGender');
if (bfGender) {
    bfGender.addEventListener('change', function () {
        const hipDiv = document.getElementById('bfHipDiv');
        if (this.value === 'female') hipDiv.style.display = 'block';
        else hipDiv.style.display = 'none';
    });
}

function calcBodyFat() {
    const gender = document.getElementById('bfGender').value;
    const h = parseFloat(document.getElementById('bfHeight').value);
    const neck = parseFloat(document.getElementById('bfNeck').value);
    const waist = parseFloat(document.getElementById('bfWaist').value);
    const hip = parseFloat(document.getElementById('bfHip').value);

    // US Navy formülü için boyun şarttır
    if (h && neck && waist) {
        let bf = 0;
        if (gender === 'male') {
            // Erkek: 495 / (1.0324 - 0.19077(log(bel-boyun)) + 0.15456(log(boy))) - 450
            bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
        } else {
            // Kadın (Kalça dahil)
            if (!hip) return alert("Kadınlar için kalça ölçüsü gereklidir.");
            bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(h)) - 450;
        }

        document.getElementById('bfValue').innerText = "%" + bf.toFixed(1);

        let status = "Normal";
        if (bf < 10) status = "Çok Düşük (Atletik)";
        else if (bf > 25 && gender === 'male') status = "Yüksek (Obezite Sınırı)";
        else if (bf > 32 && gender === 'female') status = "Yüksek (Obezite Sınırı)";

        document.getElementById('bfStatus').innerText = status;
        document.getElementById('bfResult').classList.remove('d-none');
    }
}

// --- 4. BMI HESAPLAMA ---
function calcBMI() {
    const h = parseFloat(document.getElementById('bmiHeight').value) / 100; // metreye çevir
    const w = parseFloat(document.getElementById('bmiWeight').value);

    if (h && w) {
        const bmi = (w / (h * h)).toFixed(2);
        document.getElementById('bmiVal').innerText = bmi;

        let status = "Normal";
        if (bmi < 18.5) status = "Zayıf";
        else if (bmi < 25) status = "Normal Kilo";
        else if (bmi < 30) status = "Fazla Kilolu";
        else status = "Obez";

        document.getElementById('bmiStatus').innerText = status;
        document.getElementById('bmiResult').classList.remove('d-none');
    }
}

// --- 5. BMR (BAZAL METABOLİZMA) ---
function calcBMR() {
    const gender = document.getElementById('bmrGender').value;
    const age = parseFloat(document.getElementById('bmrAge').value);
    const h = parseFloat(document.getElementById('bmrHeight').value);
    const w = parseFloat(document.getElementById('bmrWeight').value);

    if (age && h && w) {
        // Mifflin-St Jeor Formülü
        let bmr = (10 * w) + (6.25 * h) - (5 * age);
        bmr += (gender === 'male') ? 5 : -161;

        document.getElementById('bmrVal').innerText = bmr.toFixed(2) + " Kalori / Gün";
        document.getElementById('bmrResult').classList.remove('d-none');
    }
}

// --- 6. MAX KALP ATIŞ HIZI ---
function calcHeartRate() {
    const age = parseFloat(document.getElementById('hrAge').value);
    const intensity = parseFloat(document.getElementById('hrIntensity').value);

    if (age) {
        const max = 220 - age;
        const target = Math.round(max * intensity);

        document.getElementById('hrValue').innerText = target;
        document.getElementById('hrResult').classList.remove('d-none');
    }
}
// --- 7. SU İHTİYACI HESAPLAMA (YENİ EKLENEN) ---
function calcWater() {
    const w = parseFloat(document.getElementById('waterWeight').value);

    if (w > 0) {
        // Genel formül: Kilo / 30 (Litre cinsinden)
        const water = (w / 30).toFixed(2);

        document.getElementById('waterVal').innerText = water + " Litre";
        document.getElementById('waterResult').classList.remove('d-none');
    } else {
        alert("Lütfen kilonuzu giriniz.");
    }
}
// --- İDEAL KİLO HESAPLAMA (Devine Formülü) ---
function calcIdeal() {
    const gender = document.getElementById('idealGender').value;
    const h = parseFloat(document.getElementById('idealHeight').value);

    if (h > 0) {
        // Boyu inç cinsine çevir (Formül inç ile çalışır)
        // 1 inç = 2.54 cm
        const heightInInches = h / 2.54;

        // 5 fit = 60 inç. Formül 60 inç üzerindeki her inç için ekleme yapar.
        const baseInches = 60;

        let idealWeight = 0;

        if (gender === 'male') {
            // Erkek: 50kg + 2.3kg * (Boy(inç) - 60)
            idealWeight = 50 + 2.3 * (heightInInches - baseInches);
        } else {
            // Kadın: 45.5kg + 2.3kg * (Boy(inç) - 60)
            idealWeight = 45.5 + 2.3 * (heightInInches - baseInches);
        }

        // Sonucu yuvarla ve göster
        document.getElementById('idealVal').innerText = idealWeight.toFixed(1) + " kg";
        document.getElementById('idealResult').classList.remove('d-none');
    } else {
        alert("Lütfen geçerli bir boy giriniz.");
    }
}