/* =========================
   PROFILE & VENDOR LOGIC
========================= */
const profileBtn = document.getElementById("profileBtn");
const vendorModal = document.getElementById("vendorModal");

const authSection = document.getElementById("authSection");
const profileSection = document.getElementById("profileSection");

const actionBtn = document.getElementById("actionBtn");
const toggleAuth = document.getElementById("toggleAuth");
const errorText = document.getElementById("errorText");

const saveBtn = document.getElementById("saveAvailability");
const editTime = document.getElementById("editTime");
const editPercent = document.getElementById("editPercent");
const saveMsg = document.getElementById("saveMsg");

const vendorNameInput = document.getElementById("vendorName");
const vendorFoodCourt = document.getElementById("vendorFoodCourt");
const vendorStall = document.getElementById("vendorStall");

const profileName = document.getElementById("profileName");
const profileFoodCourt = document.getElementById("profileFoodCourt");
const profileStall = document.getElementById("profileStall");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

const wasteCount = document.getElementById("wasteCount");
const streakCount = document.getElementById("streakCount");

const logoutBtn = document.getElementById("logoutBtn");

const dailyQuizBtn = document.getElementById("dailyQuizBtn");
const quizModal = document.getElementById("quizModal");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizOptions = document.querySelectorAll(".quiz-option");
const quizInfo = document.getElementById("quizInfo");
const quizProgress = document.getElementById("quizProgress");
const quizLives = document.getElementById("quizLives");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const exitQuizBtn = document.getElementById("exitQuizBtn");
let quizEnded = false;

let quizSet = [];
let currentQ = 0;
let lives = 3;

let isLoginMode = false;

const API_BASE = "https://foodpulse-backend.onrender.com/api";

/* =========================
   FOOD COURT → STALL DATA
========================= */
const foodCourtStalls = {
    "Food Court 1": [
        "Japanese Curry",
        "Western Food",
        "Chicken Rice",
        "Ban Mian / Fish Soup",
        "Drinks & Snacks Stall"
    ],
    "Food Court 2": [
        "Indonesian Express",
        "Japanese Food",
        "Yong Tau Foo",
        "Vegetarian",
        "Malay / Indian"
    ],
    "Food Court 3": [
        "SP Mini Wok",
        "Chicken Rice / Nasi Lemak",
        "Mala Xiang Guo",
        "Indonesian Express",
        "Thai Food",
        "Chinese Cuisine / Dumplings",
        "Western Food",
        "Waffles Store",
        "Drinks & Fruits Stall"
    ],
    "Food Court 4": [
        "M&B Western",
        "Tamagood (Bake & Bowl)",
        "Taiwanese Cuisine",
        "Thai Food",
        "Ban Mian / Fish Soup",
        "Breakfast & Toast Stall",
        "Fruit Stall",
        "Drinks Stall"
    ],
    "Food Court 5": [
        "KFC",
        "Subway",
        "Starbucks",
        "Bang Deli",
        "Brunch Cafe",
        "Fruit Stall"
    ],
    "Food Court 6": [
        "Creamy Duck",
        "Chicken Rice Stall",
        "Japanese Stall",
        "Western Stall",
        "Thai Shop",
        "Malay Food",
        "Noodle / Soup Stall",
        "Drinks & Dessert Stall"
    ]
};

const quizQuestions = [
    {
        q: "Which category typically accounts for the largest portion of food waste in Singaporean food courts?",
        options: [
            "Expired raw ingredients",
            "Food preparation scraps (peels, bones)",
            "Unsold cooked food at the end of the day",
            "Plate waste from consumers"
        ],
        answer: 2,
        info: "Vendors often over-produce food, leading to large amounts of cooked food being discarded at closing."
    },
    {
        q: "What is a 'closed-loop' food waste system?",
        options: [
            "Sharing leftovers with other vendors",
            "Turning food waste into compost or water on-site",
            "Banning takeaway containers",
            "Recycling plastic spoons"
        ],
        answer: 1,
        info: "Food digesters convert waste into fertilizer or non-potable water."
    },
    {
        q: "Which is a major barrier for food donation?",
        options: [
            "Lack of appetite from students",
            "Food safety and liability concerns",
            "High cost of bags",
            "Security regulations"
        ],
        answer: 1,
        info: "Vendors fear legal repercussions despite the Good Samaritan Act."
    },
    {
        q: "How can smart scales reduce waste?",
        options: [
            "Weigh students",
            "Track food waste patterns",
            "Standardize portions",
            "Charge by tray weight"
        ],
        answer: 1,
        info: "Data helps vendors identify over-prepared dishes."
    },
    {
        q: "What does the Clean Plate Campaign target?",
        options: [
            "Water savings",
            "Increased sales",
            "Reducing plate waste",
            "Faster cleaning"
        ],
        answer: 2,
        info: "It encourages students to only order what they can finish."
    }
];

/* =========================
   OPEN PROFILE MODAL
========================= */
profileBtn.addEventListener("click", () => {
    vendorModal.style.display = "flex";

    const token = localStorage.getItem("token");

    if (!token) {
        profileSection.style.display = "none";
        authSection.style.display = "block";
        showRegisterMode();

        // Hide Daily Quiz for guests
        dailyQuizBtn.style.display = "none";
        return;
    }

    fetch(`${API_BASE}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(user => {
        if (user.stats) {
            document.getElementById("coinAmount").textContent = user.stats.coins;
            wasteCount.textContent = user.stats.reduced_waste;
            streakCount.textContent = user.stats.daily_streak;
        }
        authSection.style.display = "none";
        profileSection.style.display = "block";

        profileName.textContent = user.username;
        profileFoodCourt.textContent = user.foodCourt || "";
        profileStall.textContent = user.stall || "";

        // Show Daily Quiz button ONLY for logged-in users
        dailyQuizBtn.style.display = "inline-block";
    })
    .catch(() => {
        localStorage.removeItem("token");
        showRegisterMode();

        // Hide Daily Quiz if auth fails
        dailyQuizBtn.style.display = "none";
    });
});

/* =========================
   CLOSE MODAL
========================= */
vendorModal.addEventListener("click", (e) => {
    if (e.target === vendorModal) {
        vendorModal.style.display = "none";
    }
});

if (saveBtn) {
    saveBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");

        if (!token) {
            saveMsg.textContent = "Not logged in";
            return;
        }

        fetch(`${API_BASE}/update-availability`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                timePeriod: editTime.value,
                percentage: Number(editPercent.value)
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                saveMsg.textContent = data.error;
            } else {
                saveMsg.textContent = "Updated successfully ✅";
            }
        })
        .catch(() => {
            saveMsg.textContent = "Server error";
        });
    });
}

/* =========================
   DYNAMIC STALL DROPDOWN
========================= */
if (vendorFoodCourt && vendorStall) {
    vendorFoodCourt.addEventListener("change", () => {
        const selectedFC = vendorFoodCourt.value;

        vendorStall.innerHTML = `<option value="">Select Food Stall</option>`;
        vendorStall.disabled = true;

        if (!selectedFC || !foodCourtStalls[selectedFC]) return;

        foodCourtStalls[selectedFC].forEach(stall => {
            const option = document.createElement("option");
            option.value = stall;
            option.textContent = stall;
            vendorStall.appendChild(option);
        });

        vendorStall.disabled = false;
    });
}

function isValidUsername(name) {
    return /^[A-Za-z](?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{4,29}$/.test(name);
}

function showError(message) {
    errorText.textContent = message;
    errorText.style.display = "block";
}

/* =========================
   REGISTER / LOGIN
========================= */
actionBtn.addEventListener("click", () => {
    errorText.style.display = "none";

    const name = vendorNameInput.value.trim();
    const foodCourt = vendorFoodCourt.value;
    const stall = vendorStall.value;

    if (!isValidUsername(name)) {
        showError("Invalid username format.");
        return;
    }

    /* ========= REGISTER ========= */
    if (!isLoginMode) {
        if (!foodCourt || !stall) {
            showError("Please select Food Court and Food Stall.");
            return;
        }

        fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: name, foodCourt, stall })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
                return;
            }
            localStorage.setItem("token", data.token);
            vendorModal.style.display = "none";
        })
        .catch(() => showError("Server error. Please try again."));
    }

    /* ========= LOGIN ========= */
    else {
        fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: name })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
                return;
            }
            localStorage.setItem("token", data.token);
            vendorModal.style.display = "none";
        })
        .catch(() => showError("Server error. Please try again."));
    }
});

function showLoginMode() {
    isLoginMode = true;

    actionBtn.textContent = "Login";
    toggleAuth.textContent = "Not a member? Register";

    vendorFoodCourt.style.display = "none";
    vendorStall.style.display = "none";

    errorText.style.display = "none";
}

function showRegisterMode() {
    isLoginMode = false;

    actionBtn.textContent = "Register";
    toggleAuth.textContent = "Already a member? Sign In";

    vendorFoodCourt.style.display = "block";
    vendorStall.style.display = "block";

    vendorNameInput.value = "";
    vendorFoodCourt.value = "";
    vendorStall.innerHTML = `<option value="">Select Food Stall</option>`;
    vendorStall.disabled = true;

    errorText.style.display = "none";
}

/* =========================
   TOGGLE LOGIN / REGISTER
========================= */
if (toggleAuth) {
    toggleAuth.addEventListener("click", () => {
        isLoginMode ? showRegisterMode() : showLoginMode();
    });
}

/* =========================
   LOG OUT
========================= */

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        vendorModal.style.display = "none";
        if (dailyQuizBtn) dailyQuizBtn.style.display = "none";
    });
}

const saveClosingBtn = document.getElementById("saveClosingDiscount");

if (saveClosingBtn) {
    saveClosingBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        fetch(`${API_BASE}/closing-discount`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                foodName: document.getElementById("foodName").value,
                originalPrice: Number(document.getElementById("originalPrice").value),
                discountedPrice: Number(document.getElementById("discountedPrice").value),
                quantity: Number(document.getElementById("quantity").value),
                startTime: "5pm",
                endTime: "7pm"
            })
        })
        .then(res => res.json())
        .then(() => alert("Closing hour discount updated ✅"))
        .catch(() => alert("Error saving discount"));
    });
}

/* =========================
   PROFILE TAB SWITCHING
========================= */
tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

if (dailyQuizBtn) {
    dailyQuizBtn.addEventListener("click", () => {
        const lastPlayed = localStorage.getItem("dailyQuizTime");
        const now = Date.now();

        if (lastPlayed && now - lastPlayed < 24 * 60 * 60 * 1000) {
            alert("Daily Quiz already completed. Come back tomorrow!");
            return;
        }

        quizSet = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
        currentQ = 0;
        lives = 3;
        quizEnded = false;

        quizOptions.forEach(btn => btn.style.display = "block");
        if (exitQuizBtn) exitQuizBtn.style.display = "none";

        quizModal.style.display = "flex";
        loadQuestion();
    });
}

function loadQuestion() {
    const q = quizSet[currentQ];

    quizQuestionText.textContent = q.q;
    quizProgress.textContent = `Question ${currentQ + 1} of 3`;
    quizLives.textContent = "🍎".repeat(lives);

    quizInfo.style.display = "none";
    quizInfo.classList.remove("correct");
    nextQuestionBtn.style.display = "none";

    quizOptions.forEach((btn, i) => {
        btn.textContent = q.options[i];
        btn.disabled = false;
        btn.classList.remove("correct", "wrong");
    });
}

quizOptions.forEach(btn => {
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (quizEnded) return;

        const selected = Number(btn.dataset.index);
        const correct = quizSet[currentQ].answer;

        if (selected === correct) {
            btn.classList.add("correct");

            quizInfo.textContent = quizSet[currentQ].info;
            quizInfo.classList.add("correct");
            quizInfo.style.display = "block";

            quizOptions.forEach(b => b.disabled = true);

            setTimeout(() => {
                currentQ++;
                if (currentQ >= 3) {
                    localStorage.setItem("dailyQuizTime", Date.now());
                    alert("Quiz completed 🎉");
                    quizModal.style.display = "none";
                } else {
                    loadQuestion();
                }
            }, 1200);
        } else {
            btn.classList.add("wrong");
            btn.disabled = true;

            lives--;
            quizLives.textContent = "🍎".repeat(lives);

            if (lives === 0) {
                endQuizShowAnswers();
            }
        }
    });
});

function endQuizShowAnswers() {
    quizEnded = true;
    exitQuizBtn.style.display = "inline-block";

    quizQuestionText.innerHTML = `
        <strong>Quiz Over ❌</strong><br><br>
        ${quizSet.map((q, i) => `
            <p><strong>Q${i + 1}:</strong> ${q.q}<br>
            ✅ Answer: ${q.options[q.answer]}</p>
        `).join("")}
    `;

    quizOptions.forEach(btn => btn.style.display = "none");
    quizInfo.style.display = "none";
    quizProgress.textContent = "Quiz Ended";
}

if (exitQuizBtn) {
    exitQuizBtn.addEventListener("click", () => {
        quizModal.style.display = "none";
        quizEnded = false;

        quizOptions.forEach(btn => {
            btn.style.display = "block";
            btn.classList.remove("correct", "wrong");
        });

        exitQuizBtn.style.display = "none";
    });
}

function getRank(xp) {
    if (xp >= 2000) return "Emerald";
    if (xp >= 1400) return "Diamond";
    if (xp >= 800) return "Gold";
    if (xp >= 400) return "Silver";
    if (xp >= 100) return "Bronze";
    return "Starter";
}

if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener("click", () => {
        currentQ++;

        if (currentQ >= 3) {
            localStorage.setItem("dailyQuizTime", Date.now());
            const token = localStorage.getItem("token");

            fetch(`${API_BASE}/quiz-complete`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(reward => {
                alert(`🎉 Quiz completed!
                +10 XP
                +10 FoodPulse Coins`);
                document.getElementById("coinAmount").textContent = reward.coins;
                streakCount.textContent = reward.streak;

                quizModal.style.display = "none";
            });

        } else {
            loadQuestion();
        }
    });
}

if (wasteCount) wasteCount.textContent = "0";
if (streakCount) streakCount.textContent = "0";