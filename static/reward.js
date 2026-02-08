const API_BASE = "https://foodpulse-backend.onrender.com/api";

// Reward data
const rewards = [
    { id: 1, name: "$10 NTUC FairPrice Voucher", cost: 30, image: "static/images/ntuc_voucher.jpg" },
    { id: 2, name: "High-Quality Ergonomic Kitchen Mats", cost: 150, image: "static/images/kitchen_mat.jpg" },
    { id: 3, name: "high-speed rice cookers", cost: 250, image: "static/images/appliance.jpg" },
    { id: 4, name: "$10 Petrol Voucher", cost: 30, image: "static/images/petrol_voucher.jpg" },
    { id: 5, name: "Heavy-duty blender", cost: 200, image: "static/images/Heavy_duty_blender.jpg" },
    { id: 6, name: "$10 CapitaLand Voucher", cost: 30, image: "static/images/capital_voucher.jpg" }
];

// Load rewards on page load
document.addEventListener("DOMContentLoaded", () => {
    loadRewards();
});

function loadRewards() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to access rewards.");
        window.location.href = "index.html";
        return;
    }

    // Fetch user profile to get coins and redeemed rewards
    fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const userCoins = data.stats.coins;
        const redeemed = data.stats.redeemed_rewards || [];

        // Populate available rewards
        const availableContainer = document.getElementById("availableRewards");
        availableContainer.innerHTML = "";
        rewards.forEach(reward => {
            const card = `
                <div class="reward-card animate-in">
                    <h5>${reward.name}</h5>
                    <img src="${reward.image}" alt="${reward.name}">
                    <p>Cost: ${reward.cost} 💰</p>
                    <button class="primary-btn redeem-btn" ${userCoins < reward.cost ? 'disabled' : ''} onclick="redeemReward(${reward.id}, ${reward.cost})">Redeem</button>
                </div>
            `;
            availableContainer.innerHTML += card;
        });

        // Populate your rewards
        const yourContainer = document.getElementById("yourRewards");
        yourContainer.innerHTML = "";
        redeemed.forEach(reward => {
            const card = `
                <div class="reward-card ${reward.status === 'used' ? 'used animate-fade' : 'animate-in'}">
                    <h5>${reward.name}</h5>
                    <img src="${reward.image}" alt="${reward.name}">
                    <p>Cost: ${reward.cost} 💰</p>
                    <button class="primary-btn use-btn" ${reward.status === 'used' ? 'disabled' : ''} onclick="useReward(${reward.id})">${reward.status === 'used' ? 'Used' : 'Use'}</button>
                </div>
            `;
            yourContainer.innerHTML += card;
        });
    })
    .catch(err => console.error("Error loading rewards:", err));
}

function redeemReward(rewardId, cost) {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/redeem-reward`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rewardId, cost })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showSuccessBanner();
            loadRewards(); // Refresh to update your rewards
        } else {
            showInsufficientCoinsModal();
        }
    })
    .catch(() => alert("Server error."));
}

function useReward(rewardId) {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/use-reward`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rewardId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Reward marked as used!");
            loadRewards(); // Refresh
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(() => alert("Server error."));
}

function showSuccessBanner() {
    const banner = document.createElement("div");
    banner.className = "success-banner";
    banner.innerHTML = `
        <p>Purchase Successful! 🎉</p>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add("show"), 100);
}

function showInsufficientCoinsModal() {
    const modal = document.createElement("div");
    modal.className = "modal-overlay insufficient-modal";
    modal.innerHTML = `
        <div class="modal-card">
            <h3>You Do Not Have Enough FoodPulse Coins To Redeem</h3>
            <button class="primary-btn" onclick="this.closest('.modal-overlay').remove()">Back</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 100);
}