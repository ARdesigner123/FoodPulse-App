const API_BASE = "https://foodpulse-backend.onrender.com/api";

// Elements for ChickenRice.html (Student View)
const chickenRicePrice = document.getElementById("chickenRicePrice");
const chickenRiceQuantity = document.getElementById("chickenRiceQuantity");
const roastedPortions = document.getElementById("roastedPortions");
const steamedPortions = document.getElementById("steamedPortions");
const extraRicePrice = document.getElementById("extraRicePrice");
const extraRiceQuantity = document.getElementById("extraRiceQuantity");
const braisedEggPrice = document.getElementById("braisedEggPrice");
const braisedEggQuantity = document.getElementById("braisedEggQuantity");
const extraChickenPrice = document.getElementById("extraChickenPrice");
const extraChickenQuantity = document.getElementById("extraChickenQuantity");

// Elements for ChickenRiceVendor.html (Vendor View)
const vendorChickenRiceQuantity = document.getElementById("vendorChickenRiceQuantity");
const vendorRoastedPortions = document.getElementById("vendorRoastedPortions");
const vendorSteamedPortions = document.getElementById("vendorSteamedPortions");
const vendorExtraRiceQuantity = document.getElementById("vendorExtraRiceQuantity");
const vendorBraisedEggQuantity = document.getElementById("vendorBraisedEggQuantity");
const vendorExtraChickenQuantity = document.getElementById("vendorExtraChickenQuantity");
const logLeftoversBtn = document.getElementById("logLeftoversBtn");
const errorText = document.getElementById("errorText");

// Load data for students (ChickenRice.html)
function loadChickenRiceData() {
    fetch(`${API_BASE}/chicken-rice`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const item = data[0]; // Assuming one vendor for simplicity; adjust if multiple
                if (chickenRicePrice) chickenRicePrice.textContent = `$${item.chicken_rice_price}`;
                if (chickenRiceQuantity) chickenRiceQuantity.textContent = item.chicken_rice_quantity;
                if (roastedPortions) roastedPortions.textContent = item.roasted_portions;
                if (steamedPortions) steamedPortions.textContent = item.steamed_portions;
                if (extraRicePrice) extraRicePrice.textContent = `$${item.extra_rice_price}`;
                if (extraRiceQuantity) extraRiceQuantity.textContent = item.extra_rice_quantity;
                if (braisedEggPrice) braisedEggPrice.textContent = `$${item.braised_egg_price}`;
                if (braisedEggQuantity) braisedEggQuantity.textContent = item.braised_egg_quantity;
                if (extraChickenPrice) extraChickenPrice.textContent = `$${item.extra_chicken_price}`;
                if (extraChickenQuantity) extraChickenQuantity.textContent = item.extra_chicken_quantity;
            }
        })
        .catch(() => console.log("Error loading chicken rice data"));
}

// Function to show error message
function showError(message) {
    if (errorText) {
        errorText.textContent = message;
        errorText.style.display = "block";
    }
}

// Function to hide error message
function hideError() {
    if (errorText) {
        errorText.style.display = "none";
    }
}

// Save data for vendors (ChickenRiceVendor.html)
if (logLeftoversBtn) {
    logLeftoversBtn.addEventListener("click", () => {
        hideError();

        const token = localStorage.getItem("token");
        if (!token) {
            showError("Please login first.");
            return;
        }

        // Validation: Check for blanks, non-numeric, or negative values (quantities only)
        const inputs = [
            { value: vendorChickenRiceQuantity.value, name: "Chicken Rice Quantity" },
            { value: vendorRoastedPortions.value, name: "Roasted Portions" },
            { value: vendorSteamedPortions.value, name: "Steamed Portions" },
            { value: vendorExtraRiceQuantity.value, name: "Extra Rice Quantity" },
            { value: vendorBraisedEggQuantity.value, name: "Braised Egg Quantity" },
            { value: vendorExtraChickenQuantity.value, name: "Extra Chicken Quantity" }
        ];

        for (const input of inputs) {
            if (input.value === "" || isNaN(input.value) || parseFloat(input.value) < 0) {
                showError(`${input.name} must be a valid non-negative number and cannot be blank.`);
                return;
            }
        }

        const payload = {
            chickenRicePrice: 3.00, // Fixed price
            chickenRiceQuantity: parseInt(vendorChickenRiceQuantity.value),
            roastedPortions: parseInt(vendorRoastedPortions.value),
            steamedPortions: parseInt(vendorSteamedPortions.value),
            extraRicePrice: 0.60, // Fixed price
            extraRiceQuantity: parseInt(vendorExtraRiceQuantity.value),
            braisedEggPrice: 0.60, // Fixed price
            braisedEggQuantity: parseInt(vendorBraisedEggQuantity.value),
            extraChickenPrice: 1.60, // Fixed price
            extraChickenQuantity: parseInt(vendorExtraChickenQuantity.value)
        };

        fetch(`${API_BASE}/chicken-rice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "index.html";
            } else {
                showError("Error: " + data.error);
            }
        })
        .catch(() => showError("Server error. Please try again."));
    });
}

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadChickenRiceData();
});