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

const sideUpdateAvailabilityBtn = document.getElementById("sideUpdateAvailabilityBtn");

const sideVendorName = document.getElementById("sideVendorName");
const sideRegisterBtn = document.getElementById("sideRegisterBtn");
const sideLoginBtn = document.getElementById("sideLoginBtn");
const sideLogoutBtn = document.getElementById("sideLogoutBtn");

const logoutBtn = document.getElementById("logoutBtn");

const dailyQuizBtn = document.getElementById("dailyQuizBtn");
const quizModal = document.getElementById("quizModal");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizOptions = document.querySelectorAll(".quiz-option");
const quizInfo = document.getElementById("quizInfo");
const quizProgress = document.getElementById("quizProgress");
const quizLives = document.getElementById("quizLives");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

const profileBackBtn = document.getElementById("profileBackBtn");

const exitQuizBtn = document.getElementById("exitQuizBtn");
let quizEnded = false;

let quizSet = [];
let currentQ = 0;
let lives = 3;

let isLoginMode = false;

const API_BASE = "https://foodpulse-backend.onrender.com/api";

// References to side menu elements for toggling
const sideMenu = document.getElementById("sideMenu");
const sideOverlay = document.getElementById("sideOverlay");

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
        "Turkish & Mediterranean Kebab Stall",
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
        info: "While plate waste is high, vendors often struggle with over-production, leading to large amounts of cooked food being thrown away at closing."
    },
    {
        q: "What is a 'closed-loop' food waste system often implemented in Singaporean institutions?",
        options: [
            "Sharing leftovers with other vendors",
            "Turning food waste into compost or non-potable water on-site",
            "Banning all take-away containers",
            "Recycling plastic spoons"
        ],
        answer: 1,
        info: "Systems like food digesters (which SP has utilized) process waste into fertilizer or water."
    },
    {
        q: "Which of these is a major barrier for SP vendors when trying to donate surplus food?",
        options: [
            "Lack of appetite from students",
            "Concerns over food safety and liability",
            "High cost of biodegradable bags",
            "Campus security regulations"
        ],
        answer: 1,
        info: "Vendors often fear legal repercussions if someone falls ill from donated 'old' food, despite the Good Samaritan Food Donation Act."
    },
    {
        q: "How can 'Smart Scales' help SP vendors reduce waste?",
        options: [
            "By weighing students to see how much they eat",
            "By tracking the type and weight of food thrown away to identify patterns",
            "By ensuring every portion is exactly the same size",
            "By charging customers based on the weight of their tray"
        ],
        answer: 1,
        info: "Data allows vendors to see if they are consistently over-preparing specific dishes."
    },
    {
        q: "What is the primary purpose of the 'Clean Plate Campaign' often seen in polytechnics?",
        options: [
            "To save water on dishwashing",
            "To encourage students to buy more food",
            "To reduce consumer-generated plate waste",
            "To help vendors clean their stalls faster"
        ],
        answer: 2,
        info: "It focuses on behavioral change, encouraging diners to only order what they can finish."
    },
    {
        q: "In the 'Waste Hierarchy,' which action is more preferred than recycling food waste?",
        options: [
            "Landfilling",
            "Incineration",
            "Reduction at the source",
            "Composting"
        ],
        answer: 2,
        info: "Preventing waste from being created in the first place is always the most sustainable option."
    },
    {
        q: "Which pricing strategy can help vendors clear stock before the food court closes?",
        options: [
            "Increasing prices for dinner",
            "Flash sales or 'Happy Hour' discounts in the final hour",
            "Fixed pricing regardless of time",
            "Buy-one-get-one-free at lunch"
        ],
        answer: 1,
        info: "This incentivizes students to buy remaining portions that would otherwise be discarded."
    },
    {
        q: "What is 'Plate Waste' specifically?",
        options: [
            "The energy used to wash plates",
            "Food that is dropped on the floor",
            "Edible food left behind by consumers after a meal",
            "Broken ceramic plates"
        ],
        answer: 2,
        info: "This is a key metric for schools to measure how 'appetizing' or 'right-sized' the portions are."
    },
    {
        q: "Which NEA (National Environment Agency) initiative affects large food waste generators in Singapore?",
        options: [
            "The No-Plastic-Straw Law",
            "Mandatory reporting and segregation of food waste",
            "The Free Meal Voucher Scheme",
            "The High-Sugar Drink Ban"
        ],
        answer: 1,
        info: "Large commercial and industrial buildings (including some campuses) are now required to segregate food waste for treatment."
    },
    {
        q: "How can 'Ugly Food' programs help SP vendors?",
        options: [
            "By making the stall look less modern",
            "By serving food that is expired",
            "By using bruised or oddly shaped produce that is still safe to eat",
            "By reducing the price of napkins"
        ],
        answer: 2,
        info: "Using 'imperfect' vegetables in soups or sauces reduces wholesale waste and costs."
    }
];

function updateSideMenuLoggedIn(username) {
    sideVendorName.textContent = `👤 ${username}`;
    sideVendorName.style.display = "block";

    sideRegisterBtn.style.display = "none";
    sideLoginBtn.style.display = "none";

    sideLogoutBtn.style.display = "block";
    sideUpdateAvailabilityBtn.style.display = "block";
}

function updateSideMenuLoggedOut() {
    const token = localStorage.getItem("token");
    if (token) return;

    sideVendorName.style.display = "none";
    sideUpdateAvailabilityBtn.style.display = "none";

    sideRegisterBtn.style.display = "block";
    sideLoginBtn.style.display = "block";

    sideLogoutBtn.style.display = "none";
}

if (sideUpdateAvailabilityBtn) {
    sideUpdateAvailabilityBtn.addEventListener("click", () => {
        // Close side menu
        sideMenu.style.display = "none";
        sideOverlay.style.display = "none";

        // Open vendor modal
        vendorModal.style.display = "flex";

        // Show PROFILE section
        authSection.style.display = "none";
        profileSection.style.display = "block";

        // Animate in
        profileSection.classList.remove("profile-slide-out");
        profileSection.classList.add("profile-slide-in");

        // Ensure Profile tab is active
        tabButtons.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        document.querySelector('[data-tab="profileTab"]').classList.add("active");
        document.getElementById("profileTab").classList.add("active");

        // Scroll to Vendor Edit section
        const vendorEditSection = document.getElementById("vendorEditSection");
        if (vendorEditSection) {
            vendorEditSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

if (profileBackBtn) {
    profileBackBtn.addEventListener("click", () => {

        // Start slide-out animation
        profileSection.classList.remove("profile-slide-in");
        profileSection.classList.add("profile-slide-out");

        // Wait for animation to finish
        setTimeout(() => {
            // Close profile modal
            vendorModal.style.display = "none";

            // Reset animation state (important for next open)
            profileSection.classList.remove("profile-slide-out");

            // Re-open side menu
            sideMenu.style.display = "block";
            sideOverlay.style.display = "block";

            // Ensure correct side menu state
            const username = localStorage.getItem("username");
            if (username) {
                updateSideMenuLoggedIn(username);
            } else {
                updateSideMenuLoggedOut();
            }

        }, 300); // must match CSS animation duration
    });
}

/* =========================
   OPEN PROFILE MODAL
========================= */
function loadVendorProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Profile loaded successfully.");
        profileName.textContent = data.username;
        profileFoodCourt.textContent = data.foodCourt;
        profileStall.textContent = data.stall;

        wasteCount.textContent = data.stats.reduced_waste || 0;
        streakCount.textContent = data.stats.daily_streak || 0;
        document.getElementById("coinAmount").textContent = data.stats.coins || 0;

        // Update Rank tab
        const rankName = document.querySelector(".rank-name");
        const xpProgress = document.querySelector(".xp-progress");
        const xpText = document.querySelector(".xp-text");

        const currentXP = data.stats.xp;
        const currentRank = data.stats.rank; // Use rank from DB
        const ranks = [
            { rank: "Starter", min_xp: 0 },
            { rank: "Bronze", min_xp: 100 },
            { rank: "Silver", min_xp: 400 },
            { rank: "Gold", min_xp: 800 },
            { rank: "Diamond", min_xp: 1400 },
            { rank: "Emerald", min_xp: 2000 }
        ];

        // Find next rank
        let nextRank = null;
        let nextRankMinXP = null;
        for (let i = 0; i < ranks.length; i++) {
            if (ranks[i].rank === currentRank && i < ranks.length - 1) {
                nextRank = ranks[i + 1].rank;
                nextRankMinXP = ranks[i + 1].min_xp;
                break;
            }
        }

        // Check if streak needs to reset (24 hours passed since last quiz)
        const lastQuizDate = data.stats.last_quiz_date;
        if (lastQuizDate) {
            const lastDate = new Date(lastQuizDate);
            const now = new Date();
            const timeDiff = now - lastDate;
            if (timeDiff > 24 * 60 * 60 * 1000) {
                // Reset streak to 0
                fetch(`${API_BASE}/reset-streak`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(() => {
                    streakCount.textContent = 0; // Update UI
                })
                .catch(() => console.log("Failed to reset streak"));
            }
        }

        if (token) {
            document.getElementById("dailyQuizBtn").style.display = "block";
        }

        if (rankName) rankName.textContent = currentRank;

        loadQuests('daily'); // Load daily quests

        // Calculate progress for current level
        let progressPercent = 100; // Default to full if max rank
        let xpTextContent = "Max Rank Reached";

        if (nextRank) {
            const currentRankMinXP = ranks.find(r => r.rank === currentRank).min_xp;
            const levelXP = currentXP - currentRankMinXP;
            const levelXPRequired = nextRankMinXP - currentRankMinXP;
            progressPercent = (levelXP / levelXPRequired) * 100;
            xpTextContent = `${levelXP} / ${levelXPRequired} XP to ${nextRank}`;
        }

        if (xpProgress) xpProgress.style.width = `${progressPercent}%`;
        if (xpText) xpText.textContent = xpTextContent;

        // Store username for side menu updates
        localStorage.setItem("username", data.username);
        localStorage.setItem("stall", data.stall);
        updateSideMenuLoggedIn(data.username);
    })
    .catch(() => {
        console.log("Profile fetch failed. Not resetting side menu if logged in.");
        // Do not call updateSideMenuLoggedOut() here to prevent state reset
        // localStorage.removeItem("token"); // Optional: Uncomment if you want to clear token on failure
        // localStorage.removeItem("username");
    });
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("stall"); // Added to clear stall on logout

    vendorModal.style.display = "none";

    // Reset sections
    authSection.style.display = "block";
    profileSection.style.display = "none";

    // Reset auth mode
    showRegisterMode();

    // Update side menu
    updateSideMenuLoggedOut();

    // Refresh the page after 0.3-0.6 seconds to ensure updates
    setTimeout(() => {
        window.location.reload();
    }, Math.random() * 300 + 300); // Random delay between 300 and 600 ms
}

if (sideLogoutBtn) {
    sideLogoutBtn.addEventListener("click", handleLogout);
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
    // Refresh the page after 0.3-0.6 seconds to ensure updates
}

/* =========================
   PROFILE BUTTON: OPEN SIDE MENU AND UPDATE STATE (PERSISTENT)
========================= */
profileBtn.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        // User is logged in: Ensure side menu stays in logged-in state
        updateSideMenuLoggedIn(username);
    } else {
        // User is not logged in: Show register/login options
        updateSideMenuLoggedOut();
    }

    // Toggle side menu visibility (assuming it's hidden by default)
    sideMenu.style.display = "block";
    sideOverlay.style.display = "block";

    // Optional: If you prefer the profile button to open the vendor modal instead of the side menu,
    // uncomment the code below and comment out the side menu toggle above.
    // This opens the profile modal directly, avoiding side menu state issues.
    /*
    if (token) {
        loadVendorProfile();
        authSection.style.display = "none";
        profileSection.style.display = "block";
        vendorModal.style.display = "flex";
    } else {
        authSection.style.display = "block";
        profileSection.style.display = "none";
        vendorModal.style.display = "flex";
    }
    */
});

function openAuthModal(loginMode = false) {
    // Reset modal view
    vendorModal.style.display = "flex";
    authSection.style.display = "block";
    profileSection.style.display = "none";

    // Reset animations just in case
    profileSection.classList.remove("profile-slide-in", "profile-slide-out");

    // Set correct mode
    loginMode ? showLoginMode() : showRegisterMode();
}

// Close side menu when clicking overlay
sideOverlay.addEventListener("click", () => {
    sideMenu.style.display = "none";
    sideOverlay.style.display = "none";
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

if (sideRegisterBtn) {
    sideRegisterBtn.addEventListener("click", () => {
        // Close side menu
        sideMenu.style.display = "none";
        sideOverlay.style.display = "none";

        // Open modal in REGISTER mode
        openAuthModal(false);
    });
}

if (sideLoginBtn) {
    sideLoginBtn.addEventListener("click", () => {
        // Close side menu
        sideMenu.style.display = "none";
        sideOverlay.style.display = "none";

        // Open modal in LOGIN mode
        openAuthModal(true);
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
        localStorage.setItem("username", name);
        localStorage.setItem("stall", stall);
        updateSideMenuLoggedIn(name);
        vendorModal.style.display = "none";
        loadVendorProfile();
        // Refresh the page after 0.3-0.6 seconds to ensure updates
        setTimeout(() => {
            window.location.reload();
        }, Math.random() * 300 + 300); // Random delay between 300 and 600 ms
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
        localStorage.setItem("username", data.vendor.username);
        localStorage.setItem("stall", data.vendor.stall);
        updateSideMenuLoggedIn(data.vendor.username);
        vendorModal.style.display = "none";
        loadVendorProfile();
        // Refresh the page after 0.3-0.6 seconds to ensure updates
        setTimeout(() => {
            window.location.reload();
        }, Math.random() * 300 + 300); // Random delay between 300 and 600 ms
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

// Add quest-related variables
let currentQuestType = 'daily'; // Default to daily
let questTimers = {}; // To manage timers for each type

// Function to load quests for a type
function loadQuests(type) {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/quests?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const questContainer = document.querySelector("#questTab .quest-content");
        const completedContainer = document.querySelector("#questTab .completed-quest-list");
        if (!questContainer || !completedContainer) return;

        // Load active quests (only non-completed)
        questContainer.innerHTML = `
            <div class="quest-timer" id="quest-timer-${type}">Timer: Calculating...</div>
            ${data.quests.map(quest => `
                <div class="quest-item" data-quest-id="${quest.id}">
                    <h4>${quest.title}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${quest.progress}%"></div>
                    </div>
                    <p>${Math.floor((quest.progress / 100) * quest.maxProgress)}/${quest.maxProgress}</p>
                    ${quest.progress >= 100 ? '<button class="complete-btn">Complete Quest</button>' : ''}
                </div>
            `).join('')}
        `;

        // Load completed quests
        completedContainer.innerHTML = data.completedQuests.map(quest => `
            <div class="quest-item completed">
                <h4>${quest.title} ✅</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 100%"></div>
                </div>
                <p>Completed</p>
            </div>
        `).join('');

        // Start timer for the type
        startQuestTimer(type, data.timeLeft);

        // Add event listeners for complete buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questId = e.target.closest('.quest-item').dataset.questId;
                completeQuest(questId, type);
            });
        });
    });
}

// Function to start quest timer (Singapore time)
function startQuestTimer(type, initialTimeLeft) {
    if (questTimers[type]) clearInterval(questTimers[type]);

    let timeLeft = initialTimeLeft;
    const timerElement = document.getElementById(`quest-timer-${type}`);

    questTimers[type] = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(questTimers[type]);
            loadQuests(type); // Refresh quests
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        timerElement.textContent = `Time until reset: ${hours}h ${minutes}m ${seconds}s`;

        timeLeft -= 1000;
    }, 1000);
}

// Function to complete a quest
function completeQuest(questId, type) {
    const token = localStorage.getItem("token");
    const questItem = document.querySelector(`.quest-item[data-quest-id="${questId}"]`);
    const completedContainer = document.querySelector("#questTab .completed-quest-list");

    if (!questItem || !completedContainer) return;

    // Immediately move the quest to completed section and update its appearance
    questItem.classList.add("completed");
    questItem.querySelector("h4").textContent += " ✅";
    questItem.querySelector("p").textContent = "Completed";
    questItem.querySelector(".progress-fill").style.width = "100%";
    const completeBtn = questItem.querySelector(".complete-btn");
    if (completeBtn) completeBtn.remove();

    // Move to completed quests
    completedContainer.appendChild(questItem);

    // Now send the request to the server
    fetch(`${API_BASE}/complete-quest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ questId })
    })
    .then(res => res.json())
    .then(data => {
        // Update profile and rank after server confirmation
        document.getElementById("coinAmount").textContent = data.coins;
        loadVendorProfile(); // Refresh profile
        // No need to refresh quests here since we already moved it
    })
    .catch(err => {
        console.error('Error completing quest:', err);
        // If error, revert the move (optional: add logic to put it back if needed)
    });
}

let countdownInterval; // Global variable to manage the countdown interval

if (dailyQuizBtn) {
    dailyQuizBtn.addEventListener("click", () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Check quiz status from server
        fetch(`${API_BASE}/quiz-status`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.available) {
                // Start quiz
                quizSet = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
                currentQ = 0;
                lives = 3;
                quizEnded = false;

                quizOptions.forEach(btn => btn.style.display = "block");
                if (exitQuizBtn) exitQuizBtn.style.display = "none";

                quizModal.style.display = "flex";
                loadQuestion();
            } else {
                // Show timer modal with countdown
                quizQuestionText.innerHTML = `
                    <strong>24 Hour Timer</strong><br><br>
                    <div id="countdown">Time remaining: Calculating...</div>
                `;
                quizOptions.forEach(btn => btn.style.display = "none");
                quizInfo.style.display = "none";
                quizProgress.textContent = "";
                quizLives.textContent = "";
                nextQuestionBtn.style.display = "none";
                exitQuizBtn.style.display = "inline-block";
                quizModal.style.display = "flex";

                // Start countdown with time left from server
                startCountdown(data.timeLeft);
            }
        })
        .catch(() => alert("Error checking quiz status."));
    });
}

function startCountdown(initialTimeLeft) {
    // Clear any existing countdown interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const countdownElement = document.getElementById("countdown");
    let timeLeft = initialTimeLeft;

    countdownInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null; // Reset
            quizModal.style.display = "none";
            // Quiz is now available at midnight (Singapore time)
            return;
        }

        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        countdownElement.textContent = `Time until midnight (Singapore): ${hours}h ${minutes}m ${seconds}s`;

        timeLeft -= 1000; // Decrement by 1 second
    }, 1000);
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
                    // Quiz completed successfully
                    const token = localStorage.getItem("token");

                    fetch(`${API_BASE}/quiz-complete`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(res => res.json())
                    .then(reward => {
                        quizQuestionText.innerHTML = `
                            <strong>Congrats 🎉</strong><br><br>
                            You Won 50 XP and 5 FoodPulse Coins!
                        `;
                        quizOptions.forEach(btn => btn.style.display = "none");
                        quizInfo.style.display = "none";
                        quizProgress.textContent = "";
                        quizLives.textContent = "";
                        nextQuestionBtn.style.display = "none";
                        exitQuizBtn.style.display = "inline-block";
                        document.getElementById("coinAmount").textContent = reward.coins;
                        streakCount.textContent = reward.streak;

                        // Update Rank tab with new XP
                        const rankName = document.querySelector(".rank-name");
                        const xpProgress = document.querySelector(".xp-progress");
                        const xpText = document.querySelector(".xp-text");

                        const currentXP = reward.xp; // Use the updated XP from server
                        const ranks = [
                            { rank: "Starter", min_xp: 0 },
                            { rank: "Bronze", min_xp: 100 },
                            { rank: "Silver", min_xp: 400 },
                            { rank: "Gold", min_xp: 800 },
                            { rank: "Diamond", min_xp: 1400 },
                            { rank: "Emerald", min_xp: 2000 }
                        ];

                        // Find current rank (highest where XP >= min_xp)
                        let currentRank = "Starter";
                        let currentRankMinXP = 0;
                        let nextRank = null;
                        let nextRankMinXP = null;

                        for (let i = ranks.length - 1; i >= 0; i--) {
                            if (currentXP >= ranks[i].min_xp) {
                                currentRank = ranks[i].rank;
                                currentRankMinXP = ranks[i].min_xp;
                                if (i < ranks.length - 1) {
                                    nextRank = ranks[i + 1].rank;
                                    nextRankMinXP = ranks[i + 1].min_xp;
                                }
                                break;
                            }
                        }

                        if (rankName) rankName.textContent = currentRank;

                        // Calculate progress for current level
                        let progressPercent = 100; // Default to full if max rank
                        let xpTextContent = "Max Rank Reached";

                        if (nextRank) {
                            const levelXP = currentXP - currentRankMinXP;
                            const levelXPRequired = nextRankMinXP - currentRankMinXP;
                            progressPercent = (levelXP / levelXPRequired) * 100;
                            xpTextContent = `${levelXP} / ${levelXPRequired} XP to ${nextRank}`;
                        }

                        if (xpProgress) xpProgress.style.width = `${progressPercent}%`;
                        if (xpText) xpText.textContent = xpTextContent;
                    });
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
                // Quiz failed
                quizEnded = true;
                const token = localStorage.getItem("token");

                // Update attempt (streak and date) even on failure
                fetch(`${API_BASE}/quiz-attempt`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(reward => {
                    streakCount.textContent = reward.streak; // Update streak in UI
                })
                .catch(() => console.log("Failed to update attempt"));

                quizQuestionText.innerHTML = `
                    <strong>You Lost The Daily Quiz ❌</strong><br><br>
                    You Failed to earn 50 XP and 5 FoodPulse Coins.
                `;
                quizOptions.forEach(btn => btn.style.display = "none");
                quizInfo.style.display = "none";
                quizProgress.textContent = "";
                quizLives.textContent = "";
                nextQuestionBtn.style.display = "none";
                exitQuizBtn.style.display = "inline-block";
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
        // Clear countdown on exit
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
        quizModal.style.display = "none";
        quizEnded = false;

        quizOptions.forEach(btn => {
            btn.style.display = "block";
            btn.classList.remove("correct", "wrong");
        });

        exitQuizBtn.style.display = "none";
    });
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

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (token) {
        loadVendorProfile();
    } else {
        updateSideMenuLoggedOut();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const chickenRiceCard = document.getElementById("chickenRice");
    const kebabCard = document.getElementById("kebab");

    if (!chickenRiceCard || !kebabCard) return;

    // Check if user is logged in and stall is "Chicken Rice Stall" or "Turkish & Mediterranean Kebab Stall"
    const token = localStorage.getItem("token");
    const stall = localStorage.getItem("stall");

    if (token && stall === "Chicken Rice Stall") {
        // Hide Kebab card for Chicken Rice Stall vendors
        kebabCard.style.display = "none";
    } else if (token && stall === "Turkish & Mediterranean Kebab Stall") {
        // Hide Chicken Rice card for Kebab Stall vendors
        chickenRiceCard.style.display = "none";
    }
    // For students (not logged in or no stall), show both cards (default behavior)

    chickenRiceCard.addEventListener("click", () => {
        // Vendor → Vendor page
        if (token && stall && stall === "Chicken Rice Stall") {
            window.location.href = "chickenRiceVendor.html";
        } 
        // Student → Normal menu page
        else {
            window.location.href = "chickenRice.html";
        }
    });

    kebabCard.addEventListener("click", () => {
        // Vendor → Vendor page
        if (token && stall && stall === "Turkish & Mediterranean Kebab Stall") {
            window.location.href = "kebabVendor.html";
        } 
        // Student → Normal menu page
        else {
            window.location.href = "kebab.html";
        }
    });
});

// Add event listeners for quest buttons
document.querySelectorAll('.quest-buttons .secondary-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        currentQuestType = btn.textContent.toLowerCase();
        loadQuests(currentQuestType);
    });
});

if (wasteCount) wasteCount.textContent = "0";
if (streakCount) streakCount.textContent = "0";