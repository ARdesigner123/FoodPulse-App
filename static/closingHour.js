const API_BASE = "https://foodpulse-backend.onrender.com/api";
const grid = document.getElementById("discountGrid");
const languageDropdown = document.getElementById("languageDropdown");

/* =========================
   TRANSLATIONS
========================= */
const closingHourTranslations = {
    en: {
        title: "Closing Hour Discounts",
        noDiscounts: "No closing-hour discounts available",
        error: "Error loading discounts",
        left: "left",
        back: "Back",
        language: "Language"
    },
    ms: {
        title: "Diskaun Waktu Penutupan",
        noDiscounts: "Tiada diskaun waktu penutupan",
        error: "Ralat memuatkan diskaun",
        left: "baki",
        back: "Kembali",
        language: "Bahasa"
    },
    zh: {
        title: "打烊优惠",
        noDiscounts: "目前没有打烊优惠",
        error: "加载优惠时出错",
        left: "剩余",
        back: "返回",
        language: "语言"
    },
    ta: {
        title: "மூடும் நேர தள்ளுபடிகள்",
        noDiscounts: "மூடும் நேர தள்ளுபடிகள் இல்லை",
        error: "தள்ளுபடிகளை ஏற்றுவதில் பிழை",
        left: "மீதம்",
        back: "திரும்ப",
        language: "மொழி"
    }
};

// Translation object for stalls and FC names
        const fcTranslations = {
            en: {},
            ms: {
                "Food Court 1": "Dewan Makan 1",
                "Food Court 2": "Dewan Makan 2",
                "Food Court 3": "Dewan Makan 3",
                "Food Court 4": "Dewan Makan 4",
                "Food Court 5": "Dewan Makan 5",
                "Food Court 6": "Dewan Makan 6",
                "Chicken Rice": "Nasi Ayam",
                "Indonesian Cuisine": "Masakan Indonesia",
                "Indonesian Express": "Ekspres Indonesia",
                "Japanese Curry / Rice Bowls": "Kari Jepun / Mangkuk Nasi",
                "Western Cuisine": "Makanan Barat",
                "Ban Mian / Fish Soup": "Ban Mian / Sup Ikan",
                "Mala Hotpot": "Hotpot Mala",
                "Thai Cuisine": "Masakan Thai",
                "Yong Tau Foo": "Yong Tau Foo",
                "Desserts": "Pencuci Mulut",
                "Drinks & Toast Stall": "Gerai Minuman & Roti Bakar",
                "Creamy Duck": "Creamy Duck",
                "Japanese Cuisine": "Masakan Jepun",
                "Chicken Rice": "Nasi Ayam",
                "Vegetarian Stall": "Gerai Vegetarian",
                "Mixed Vegetable Rice": "Nasi Sayur Campur",
                "Yong Tau Foo / Fish Soup": "Yong Tau Foo / Sup Ikan"
            },
            zh: {
                "Food Court 1": "食阁1",
                "Food Court 2": "食阁2",
                "Food Court 3": "食阁3",
                "Food Court 4": "食阁4",
                "Food Court 5": "食阁5",
                "Food Court 6": "食阁6",
                "Chicken Rice": "鸡饭",
                "Indonesian Cuisine": "印尼菜",
                "Indonesian Express": "印尼快餐",
                "Japanese Curry / Rice Bowls": "日式咖喱/饭",
                "Western Cuisine": "西餐",
                "Ban Mian / Fish Soup": "板面/鱼汤",
                "Mala Hotpot": "麻辣火锅",
                "Thai Cuisine": "泰式料理",
                "Yong Tau Foo": "酿豆腐",
                "Desserts": "甜品",
                "Drinks & Toast Stall": "饮料与吐司摊",
                "Creamy Duck": "Creamy Duck",
                "Japanese Cuisine": "日式料理",
                "Chicken Rice": "鸡饭",
                "Vegetarian Stall": "素食摊",
                "Mixed Vegetable Rice": "什菜饭",
                "Yong Tau Foo / Fish Soup": "酿豆腐/鱼汤"
            },
            ta: {
                "Food Court 1": "உணவக 1",
                "Food Court 2": "உணவக 2",
                "Food Court 3": "உணவக 3",
                "Food Court 4": "உணவக 4",
                "Food Court 5": "உணவக 5",
                "Food Court 6": "உணவக 6",
                "Chicken Rice": "கோழி சாதம்",
                "Indonesian Cuisine": "இந்தோனேஷிய உணவு",
                "Indonesian Express": "இந்தோனேஷிய எக்ஸ்பிரஸ்",
                "Japanese Curry / Rice Bowls": "ஜப்பானிய கறி / சாதம்",
                "Western Cuisine": "மேற்கத்திய உணவு",
                "Ban Mian / Fish Soup": "பான் மியன் / மீன் சூப்",
                "Mala Hotpot": "மாலா ஹாட்பாட்",
                "Thai Cuisine": "தை உணவு",
                "Yong Tau Foo": "யாங் டௌ ஃபூ",
                "Desserts": "இனிப்புகள்",
                "Drinks & Toast Stall": "பானங்கள் மற்றும் டோஸ்ட் ஸ்டால்",
                "Creamy Duck": "க்ரீமி டக்",
                "Japanese Cuisine": "ஜப்பானிய உணவு",
                "Chicken Rice": "கோழி சாதம்",
                "Vegetarian Stall": "சைவ உணவு ஸ்டால்",
                "Mixed Vegetable Rice": "காய்கறி கலந்த சாதம்",
                "Yong Tau Foo / Fish Soup": "யாங் டௌ ஃபூ / மீன் சூப்"
            }
        };

let currentLang = "en";

const clockEl = document.getElementById("liveClock");

function startClock() {
    setInterval(() => {
        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const mins = String(now.getMinutes()).padStart(2, "0");
        const secs = String(now.getSeconds()).padStart(2, "0");

        if (clockEl) {
            clockEl.textContent = `${hours}:${mins}:${secs}`;
        }

        handleTimeBasedUI(now);
    }, 1000);
}

function handleTimeBasedUI(now) {
    const hour = now.getHours();
    const minute = now.getMinutes();

    const cards = document.querySelectorAll(".menu-card");

    // After 7 PM → disable cards
    if (hour >= 19) {
        cards.forEach(card => {
            card.classList.add("disabled-card");
        });
    } else {
        cards.forEach(card => {
            card.classList.remove("disabled-card");
        });
    }

    // After 12 AM → clear UI
    if (hour === 0 && minute === 0) {
        grid.innerHTML = "";
    }
}

/* =========================
   APPLY TRANSLATION
========================= */
function applyLanguage(lang) {
    currentLang = lang;
    const t = closingHourTranslations[lang];

    document.getElementById("pageTitle").textContent = t.title;
    document.getElementById("langLabel").textContent = t.language;
}

function translateLabel(text) {
    if (!text) return text;

    // English stays as-is
    if (currentLang === "en") return text;

    // Translate using fcTranslations if exists
    return fcTranslations[currentLang]?.[text] || text;
}

/* =========================
   FETCH & RENDER DISCOUNTS
========================= */
function loadDiscounts() {
    fetch(`${API_BASE}/closing-discounts`)
        .then(res => res.json())
        .then(data => {
            const t = closingHourTranslations[currentLang];

            if (!Array.isArray(data) || data.length === 0) {
                grid.innerHTML = `<p>${t.noDiscounts}</p>`;
                return;
            }

            grid.innerHTML = "";

            data.forEach(d => {
                const card = document.createElement("div");
                card.className = "menu-card";

                // Translate labels
                const foodName = translateLabel(d.foodName);
                const stallName = translateLabel(d.stall);
                const foodCourtName = translateLabel(d.foodCourt);

                // FC number extraction (safe)
                const foodCourtNo = d.foodCourt
                    ? d.foodCourt.replace("Food Court ", "")
                    : "—";

                card.innerHTML = `
                    <div class="menu-overlay">
                        <span>
                            <strong>${foodName}</strong><br>
                            ${stallName} (${foodCourtName || "FC " + foodCourtNo})<br>
                            ${d.quantity} ${t.left} @ $${Number(d.price).toFixed(2)}<br>
                            ${d.time}
                        </span>
                    </div>
                `;

                grid.appendChild(card);
            });
        })
        .catch(err => {
            console.error("❌ Closing hour fetch error:", err);
            grid.innerHTML = `<p>${closingHourTranslations[currentLang].error}</p>`;
        });
}

/* =========================
   EVENTS
========================= */
languageDropdown.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
    loadDiscounts(); // re-render translated cards
});

const backBtn = document.getElementById("backBtn");
if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

/* =========================
   INIT
========================= */
applyLanguage("en");
loadDiscounts();
startClock();