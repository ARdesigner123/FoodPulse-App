const API_BASE = "https://foodpulse-backend.onrender.com/api";

// Elements for kebab.html (Student View)
const chickenKebabPrice = document.getElementById("chickenKebabPrice");
const beefKebabPrice = document.getElementById("beefKebabPrice");
const mixedKebabPrice = document.getElementById("mixedKebabPrice");
const wholemealWrapPrice = document.getElementById("wholemealWrapPrice");
const cheesePrice = document.getElementById("cheesePrice");
const eggPrice = document.getElementById("eggPrice");
const extraMeatPrice = document.getElementById("extraMeatPrice");
const chickenKebabQuantity = document.getElementById("chickenKebabQuantity");
const beefKebabQuantity = document.getElementById("beefKebabQuantity");
const mixedKebabQuantity = document.getElementById("mixedKebabQuantity");
const regularWrapQuantity = document.getElementById("regularWrapQuantity");
const wholemealWrapQuantity = document.getElementById("wholemealWrapQuantity");
const cheeseQuantity = document.getElementById("cheeseQuantity");
const eggQuantity = document.getElementById("eggQuantity");
const extraMeatQuantity = document.getElementById("extraMeatQuantity");
const standardBaseQuantity = document.getElementById("standardBaseQuantity");
const noBaseQuantity = document.getElementById("noBaseQuantity");
const mayoQuantity = document.getElementById("mayoQuantity");
const chiliSauceQuantity = document.getElementById("chiliSauceQuantity");
const garlicSauceQuantity = document.getElementById("garlicSauceQuantity");
const bbqSauceQuantity = document.getElementById("bbqSauceQuantity");
const tomatoSauceQuantity = document.getElementById("tomatoSauceQuantity");

// Elements for kebabVendor.html (Vendor View)
const vendorChickenKebabQuantity = document.getElementById("vendorChickenKebabQuantity");
const vendorBeefKebabQuantity = document.getElementById("vendorBeefKebabQuantity");
const vendorMixedKebabQuantity = document.getElementById("vendorMixedKebabQuantity");
const vendorRegularWrapQuantity = document.getElementById("vendorRegularWrapQuantity");
const vendorWholemealWrapQuantity = document.getElementById("vendorWholemealWrapQuantity");
const vendorCheeseQuantity = document.getElementById("vendorCheeseQuantity");
const vendorEggQuantity = document.getElementById("vendorEggQuantity");
const vendorExtraMeatQuantity = document.getElementById("vendorExtraMeatQuantity");
const vendorStandardBaseQuantity = document.getElementById("vendorStandardBaseQuantity");
const vendorNoBaseQuantity = document.getElementById("vendorNoBaseQuantity");
const vendorMayoQuantity = document.getElementById("vendorMayoQuantity");
const vendorChiliSauceQuantity = document.getElementById("vendorChiliSauceQuantity");
const vendorGarlicSauceQuantity = document.getElementById("vendorGarlicSauceQuantity");
const vendorBbqSauceQuantity = document.getElementById("vendorBbqSauceQuantity");
const vendorTomatoSauceQuantity = document.getElementById("vendorTomatoSauceQuantity");
const logLeftoversBtn = document.getElementById("logLeftoversBtn");
const errorText = document.getElementById("errorText");

// New elements for success modal and confirm button
const confirmBtn = document.getElementById("confirmBtn");
const successModal = document.getElementById("successModal");
const backToHomeBtn = document.getElementById("backToHomeBtn");

// Load data for students (kebab.html)
function loadKebabData() {
    fetch(`${API_BASE}/kebab`)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const item = data[0]; // Assuming one vendor for simplicity
                if (chickenKebabPrice) chickenKebabPrice.textContent = `$${item.chicken_kebab_price}`;
                if (beefKebabPrice) beefKebabPrice.textContent = `$${item.beef_kebab_price}`;
                if (mixedKebabPrice) mixedKebabPrice.textContent = `$${item.mixed_kebab_price}`;
                if (wholemealWrapPrice) wholemealWrapPrice.textContent = `$${item.wholemeal_wrap_price}`;
                if (cheesePrice) cheesePrice.textContent = `$${item.cheese_price}`;
                if (eggPrice) eggPrice.textContent = `$${item.egg_price}`;
                if (extraMeatPrice) extraMeatPrice.textContent = `$${item.extra_meat_price}`;
                if (chickenKebabQuantity) chickenKebabQuantity.textContent = item.chicken_kebab_quantity;
                if (beefKebabQuantity) beefKebabQuantity.textContent = item.beef_kebab_quantity;
                if (mixedKebabQuantity) mixedKebabQuantity.textContent = item.mixed_kebab_quantity;
                if (regularWrapQuantity) regularWrapQuantity.textContent = item.regular_wrap_quantity;
                if (wholemealWrapQuantity) wholemealWrapQuantity.textContent = item.wholemeal_wrap_quantity;
                if (cheeseQuantity) cheeseQuantity.textContent = item.cheese_quantity;
                if (eggQuantity) eggQuantity.textContent = item.egg_quantity;
                if (extraMeatQuantity) extraMeatQuantity.textContent = item.extra_meat_quantity;
                if (standardBaseQuantity) standardBaseQuantity.textContent = item.standard_base_quantity;
                if (noBaseQuantity) noBaseQuantity.textContent = item.no_base_quantity;
                if (mayoQuantity) mayoQuantity.textContent = item.mayo_quantity;
                if (chiliSauceQuantity) chiliSauceQuantity.textContent = item.chili_sauce_quantity;
                if (garlicSauceQuantity) garlicSauceQuantity.textContent = item.garlic_sauce_quantity;
                if (bbqSauceQuantity) bbqSauceQuantity.textContent = item.bbq_sauce_quantity;
                if (tomatoSauceQuantity) tomatoSauceQuantity.textContent = item.tomato_sauce_quantity;
            }
        })
        .catch(() => console.log("Error loading kebab data"));
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

// Save data for vendors (kebabVendor.html)
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
            { value: vendorChickenKebabQuantity.value, name: "Chicken Kebab Quantity" },
            { value: vendorBeefKebabQuantity.value, name: "Beef Kebab Quantity" },
            { value: vendorMixedKebabQuantity.value, name: "Mixed Kebab Quantity" },
            { value: vendorRegularWrapQuantity.value, name: "Regular Wrap Quantity" },
            { value: vendorWholemealWrapQuantity.value, name: "Wholemeal Wrap Quantity" },
            { value: vendorCheeseQuantity.value, name: "Cheese Quantity" },
            { value: vendorEggQuantity.value, name: "Egg Quantity" },
            { value: vendorExtraMeatQuantity.value, name: "Extra Meat Quantity" },
            { value: vendorStandardBaseQuantity.value, name: "Standard Base Quantity" },
            { value: vendorNoBaseQuantity.value, name: "No Base Quantity" },
            { value: vendorMayoQuantity.value, name: "Mayo Quantity" },
            { value: vendorChiliSauceQuantity.value, name: "Chili Sauce Quantity" },
            { value: vendorGarlicSauceQuantity.value, name: "Garlic Sauce Quantity" },
            { value: vendorBbqSauceQuantity.value, name: "BBQ Sauce Quantity" },
            { value: vendorTomatoSauceQuantity.value, name: "Tomato Sauce Quantity" }
        ];

        for (const input of inputs) {
            if (input.value === "" || isNaN(input.value) || parseFloat(input.value) < 0) {
                showError(`${input.name} must be a valid non-negative number and cannot be blank.`);
                return;
            }
        }

        const payload = {
            chickenKebabPrice: 4.50, // Fixed price
            beefKebabPrice: 5.00, // Fixed price
            mixedKebabPrice: 5.50, // Fixed price
            wholemealWrapPrice: 0.30, // Fixed price
            cheesePrice: 0.50, // Fixed price
            eggPrice: 0.60, // Fixed price
            extraMeatPrice: 2.00, // Fixed price
            chickenKebabQuantity: parseInt(vendorChickenKebabQuantity.value),
            beefKebabQuantity: parseInt(vendorBeefKebabQuantity.value),
            mixedKebabQuantity: parseInt(vendorMixedKebabQuantity.value),
            regularWrapQuantity: parseInt(vendorRegularWrapQuantity.value),
            wholemealWrapQuantity: parseInt(vendorWholemealWrapQuantity.value),
            cheeseQuantity: parseInt(vendorCheeseQuantity.value),
            eggQuantity: parseInt(vendorEggQuantity.value),
            extraMeatQuantity: parseInt(vendorExtraMeatQuantity.value),
            standardBaseQuantity: parseInt(vendorStandardBaseQuantity.value),
            noBaseQuantity: parseInt(vendorNoBaseQuantity.value),
            mayoQuantity: parseInt(vendorMayoQuantity.value),
            chiliSauceQuantity: parseInt(vendorChiliSauceQuantity.value),
            garlicSauceQuantity: parseInt(vendorGarlicSauceQuantity.value),
            bbqSauceQuantity: parseInt(vendorBbqSauceQuantity.value),
            tomatoSauceQuantity: parseInt(vendorTomatoSauceQuantity.value)
        };

        fetch(`${API_BASE}/kebab`, {
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

// Confirm Order for students
if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
        // Collect selected options
        const mainDish = document.querySelector('input[name="mainDish"]:checked');
        const wrapType = document.querySelector('input[name="wrapType"]:checked');
        const baseType = document.querySelector('input[name="baseType"]:checked');
        const sauces = document.querySelector('input[name="sauces"]:checked');
        const cheese = parseInt(document.getElementById("cheeseInput").value || 0);
        const egg = parseInt(document.getElementById("eggInput").value || 0);
        const extraMeat = parseInt(document.getElementById("extraMeatInput").value || 0);

        // Validate selections (ensure main dish is selected and quantities are available)
        if (!mainDish) {
            alert("Please select a main dish.");
            return;
        }

        const payload = {
            mainDish: mainDish.value, // Now has value, e.g., "Chicken Kebab Roll"
            wrapType: wrapType ? wrapType.value : "Regular Wrap", // Default if not selected
            baseType: baseType ? baseType.value : "Standard Base (Vegetables)", // Default if not selected
            sauces: sauces ? sauces.value : null,
            cheese,
            egg,
            extraMeat
        };

        fetch(`${API_BASE}/confirm-kebab-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Show success modal
                if (successModal) successModal.style.display = "flex";
                loadKebabData(); // Reload to update quantities
            } else {
                alert("Error: " + data.error);
            }
        })
        .catch(() => alert("Server error. Please try again."));
    });
}

// Back to home button
if (backToHomeBtn) {
    backToHomeBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

// Load data on page load
document.addEventListener("DOMContentLoaded", () => {
    loadKebabData();
});