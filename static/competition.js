const API_BASE = "https://foodpulse-backend.onrender.com/api";

// Persistent event end date using localStorage
function getEventEndDate() {
    const storedEnd = localStorage.getItem("competitionEndDate");
    const now = new Date();
    let endDate;

    if (storedEnd) {
        endDate = new Date(storedEnd);
        if (endDate <= now) {
            // Event has ended, reset to new 2-month period
            endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 2);
            localStorage.setItem("competitionEndDate", endDate.toISOString());
        }
    } else {
        // No stored date, set new 2-month period
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 2);
        localStorage.setItem("competitionEndDate", endDate.toISOString());
    }

    return endDate;
}

const endDate = getEventEndDate();

// Countdown timer with persistence
function updateCountdown() {
    const now = new Date();
    const timeLeft = endDate - now;

    if (timeLeft <= 0) {
        document.getElementById("countdown").innerHTML = "<span class='ended'>Event Ended! Refreshing...</span>";
        // Reset for new event and fetch new data
        setTimeout(() => {
            localStorage.removeItem("competitionEndDate"); // Clear stored date
            location.reload(); // Reload page to reset timer and fetch new data
        }, 3000); // Delay to show "ended" message
        return;
    }

    const months = Math.floor(timeLeft / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeLeft % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `
        <span class="time">${months}<small>M</small></span>
        <span class="time">${days}<small>D</small></span>
        <span class="time">${hours}<small>H</small></span>
        <span class="time">${minutes}<small>M</small></span>
        <span class="time">${seconds}<small>S</small></span>
    `;
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// Fetch and display competition data
function loadCompetitionData() {
    const token = localStorage.getItem("token"); // Check if user is logged in
    let userPosition = null;

    fetch(`${API_BASE}/competition`)
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error("Error: Data is not an array", data);
                return;
            }

            const tbody = document.querySelector("#competitionTable tbody");
            tbody.innerHTML = "";

            data.forEach((vendor, index) => {
                const position = index + 1;
                const reducedWaste = vendor.vendor_stats?.reduced_waste || 0;
                let positionIcon = "";
                let rowClass = "";

                if (position === 1) {
                    positionIcon = "🏆";
                    rowClass = "gold-row";
                } else if (position === 2) {
                    positionIcon = "🥈";
                    rowClass = "silver-row";
                } else if (position === 3) {
                    positionIcon = "🥉";
                    rowClass = "bronze-row";
                } else if (position <= 5) {
                    positionIcon = "🎖️";
                    rowClass = "purple-row";
                }

                // Check if this is the current user
                if (token && vendor.username === localStorage.getItem("username")) {
                    userPosition = position;
                }

                const row = `
                    <tr class="table-row ${rowClass}">
                        <td>${positionIcon} ${position}</td>
                        <td>${vendor.username}</td>
                        <td>${reducedWaste} Dishes</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });

            // Update rewards text based on user position
            const rewardsText = document.getElementById("rewards-text");
            if (userPosition) {
                let rewards = "";
                if (userPosition === 1) {
                    rewards = "+1 Certificate, +1 Gold Badge, +500 FoodPulse Coins, +3000 XP";
                } else if (userPosition <= 2) {
                    rewards = "+1 Certificate, +1 Silver Badge, +200 FoodPulse Coins, +800 XP";
                } else if (userPosition <= 3) {
                    rewards = "+1 Certificate, +1 Bronze Badge, +50 FoodPulse Coins, +300 XP";
                } else if (userPosition <= 5) {
                    rewards = "+1 Certificate, +20 FoodPulse Coins, +100 XP";
                }
                rewardsText.textContent = `Your Position: ${userPosition} - ${rewards}`;
            } else {
                rewardsText.textContent = "Log in to see your rewards based on your position!";
            }
        })
        .catch(err => console.error("Error fetching competition data:", err));
}

loadCompetitionData(); // Initial load