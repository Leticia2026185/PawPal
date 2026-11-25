
/* =========================================
   PAWPAL - JAVASCRIPT
   ========================================= */


/* =========================================
   1. SERVICE BUTTONS
   ========================================= */

// Select the service buttons
const dogButton = document.getElementById("dogButton");
const petButton = document.getElementById("petButton");
const homeButton = document.getElementById("homeButton");

// Select the message area
const serviceMessage = document.getElementById("serviceMessage");

// Dog Walking button
if (dogButton) {
    dogButton.addEventListener("click", function () {
        serviceMessage.textContent =
            "Dog Walking: We take your dog for a safe and enjoyable walk.";
    });
}

// Pet Sitting button
if (petButton) {
    petButton.addEventListener("click", function () {
        serviceMessage.textContent =
            "Pet Sitting: We take care of your pet while you are away.";
    });
}

// Home Visits button
if (homeButton) {
    homeButton.addEventListener("click", function () {
        serviceMessage.textContent =
            "Home Visits: We visit your pet at home and make sure they are comfortable.";
    });
}


/* =========================================
   2. CONTACT FORM VALIDATION
   ========================================= */

function validateForm() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Check if the name contains only letters
    const namePattern = /^[A-Za-z\s]+$/;

    // Check phone number
    const phonePattern = /^[0-9]{9,10}$/;

    // Check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(name)) {
        alert("Please enter a valid name.");
        return false;
    }

    if (!phonePattern.test(phone)) {
        alert("Please enter a valid phone number.");
        return false;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (message === "") {
        alert("Please enter a message.");
        return false;
    }

    alert("Thank you! Your message has been sent.");

    return false;
}


/* =========================================
   3. PRODUCTS AND BASKET
   ========================================= */

// Select the HTML elements
const productsContainer = document.getElementById("productsContainer");
const basketContainer = document.getElementById("basketContainer");
const basketTotal = document.getElementById("basketTotal");

// Create an empty basket
const basket = [];


/* =========================================
   4. LOAD PRODUCTS FROM DATABASE
   ========================================= */

if (productsContainer) {

    fetch("/products")

        .then(function (response) {
            return response.json();
        })

        .then(function (products) {

            productsContainer.innerHTML = "";

            products.forEach(function (product) {

                // Create product card
                const productBox = document.createElement("div");

                productBox.className = "product-box";

                productBox.innerHTML = `
                    <img src="images/${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>€${Number(product.price).toFixed(2)}</p>
                    <button class="addBasketButton">Add to Basket</button>
                `;

                // Select the Add to Basket button
                const addButton =
                    productBox.querySelector(".addBasketButton");

                // Add product to basket
                addButton.addEventListener("click", function () {

                    const existingProduct = basket.find(function (item) {
                        return item.id === product.id;
                    });

                    // If product already exists, increase quantity
                    if (existingProduct) {

                        existingProduct.quantity++;

                    } else {

                        // Otherwise, add a new product
                        basket.push({
                            id: product.id,
                            name: product.name,
                            price: Number(product.price),
                            quantity: 1
                        });

                    }

                    renderBasket();

                });

                // Add product to the page
                productsContainer.appendChild(productBox);

            });

        })

        .catch(function (error) {
            console.error("Error loading products:", error);

            productsContainer.innerHTML =
                "<p>Unable to load products.</p>";
        });

}


/* =========================================
   5. DISPLAY BASKET
   ========================================= */

function renderBasket() {

    // Check if basket elements exist
    if (!basketContainer || !basketTotal) {
        console.log("Basket elements not found.");
        return;
    }

    // Clear previous basket content
    basketContainer.innerHTML = "";

    // Start total at zero
    let total = 0;

    // Display each product in the basket
    basket.forEach(function (item, index) {

        // Calculate subtotal for the product
        const itemTotal = item.price * item.quantity;

        // Add subtotal to the total
        total += itemTotal;

        // Create basket item
        const basketItem = document.createElement("div");

        basketItem.className = "basket-item";

        basketItem.innerHTML = `
            <p>
                <strong>${item.name}</strong>
                - €${item.price.toFixed(2)}
                - Quantity: ${item.quantity}
                - Subtotal: €${itemTotal.toFixed(2)}
                <button class="removeBasketButton">Remove</button>
            </p>
        `;

        // Select Remove button
        const removeButton =
            basketItem.querySelector(".removeBasketButton");

        // Remove product from basket
        removeButton.addEventListener("click", function () {

            basket.splice(index, 1);

            renderBasket();

        });

        // Add item to basket display
        basketContainer.appendChild(basketItem);

    });

    // Display total price
    basketTotal.textContent = "Total: €" + total.toFixed(2);

}


/* =========================================
   6. CHECKOUT
   ========================================= */

function checkout() {

    // Check if basket is empty
    if (basket.length === 0) {

        alert("Your basket is empty!");

        return;

    }

    // Calculate total
    let total = 0;

    basket.forEach(function (item) {

        total += item.price * item.quantity;

    });

    // Show checkout confirmation
    alert(
        "Order confirmed!\n\n" +
        "Total: €" + total.toFixed(2) +
        "\n\nThank you for shopping with PawPal!"
    );

    // Empty basket after checkout
    basket.length = 0;
    

    renderBasket();

}

// Connect Checkout button
const checkoutButton = document.getElementById("checkoutButton");

if (checkoutButton) {
    checkoutButton.addEventListener("click", checkout);
}
