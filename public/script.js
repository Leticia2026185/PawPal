
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

// Dog Walking button
if (dogButton) {
    dogButton.addEventListener("click", function () {
        document.getElementById("dogMessage").textContent =
            "Dog Walking: We take your dog for a safe and enjoyable walk.";
    });
}

// Pet Sitting button
if (petButton) {
    petButton.addEventListener("click", function () {
        document.getElementById("petMessage").textContent =
            "Pet Sitting: We take care of your pet while you are away.";
    });
}

// Home Visits button
if (homeButton) {
    homeButton.addEventListener("click", function () {
        document.getElementById("homeMessage").textContent =
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

    // Patterns (regular expressions) to check the format of the fields
    // Check if the name contains only letters
    const namePattern = /^[A-Za-z\s]+$/;

    // Check phone number (9 or 10 numbers)
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

    // return false stops the form from reloading the page
    return false;
}


/* =========================================
   3. PRODUCTS AND BASKET
   ========================================= */

// Select the HTML elements
const productsContainer = document.getElementById("productsContainer");
const basketContainer = document.getElementById("basketContainer");
const basketTotal = document.getElementById("basketTotal");

// Load the basket from localStorage (or start with an empty basket)
// localStorage keeps the basket when the user goes to another page
// JSON.parse changes the saved text back into an array
let basket = JSON.parse(localStorage.getItem("basket")) || [];

// Save the basket in localStorage
function saveBasket() {
    // localStorage only keeps text, so JSON.stringify changes the array into text
    localStorage.setItem("basket", JSON.stringify(basket));
}

// Calculate the total price of the basket
function calculateTotal() {
    let total = 0;

    basket.forEach(function (item) {
        total += item.price * item.quantity;
    });

    return total;
}


/* =========================================
   4. LOAD PRODUCTS FROM DATABASE
   ========================================= */

if (productsContainer) {

    // Ask the server for the products (GET /products)
    fetch("/products")

        .then(function (response) {
            return response.json();
        })

        // products is the array that came from the database
        .then(function (products) {

            // Remove the "Loading products..." text
            productsContainer.innerHTML = "";

            products.forEach(function (product) {

                // Create product card
                const productBox = document.createElement("div");

                productBox.className = "product-box";

                // ${...} puts the product data inside the HTML
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

                    // find looks for the same product id in the basket
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

    // Save the basket every time it changes
    saveBasket();

    // Check if basket elements exist (they are only on services.html)
    if (!basketContainer || !basketTotal) {
        return;
    }

    // Clear previous basket content
    basketContainer.innerHTML = "";

    // Show a message if the basket is empty
    if (basket.length === 0) {
        basketContainer.innerHTML = "<p>Your basket is empty.</p>";
    }

    // Display each product in the basket
    basket.forEach(function (item, index) {

        // Calculate subtotal for the product
        const itemTotal = item.price * item.quantity;

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

        // Remove one unit of the product from the basket
        removeButton.addEventListener("click", function () {

            item.quantity--;

            // If the quantity is zero, remove the product
            if (item.quantity === 0) {
                // splice removes 1 item from the array at this position
                basket.splice(index, 1);
            }

            renderBasket();

        });

        // Add item to basket display
        basketContainer.appendChild(basketItem);

    });

    // Display total price
    basketTotal.textContent = "Total: €" + calculateTotal().toFixed(2);

}

// Show the saved basket when the services page opens
renderBasket();


/* =========================================
   6. CHECKOUT BUTTON (services.html)
   ========================================= */

const checkoutButton = document.getElementById("checkoutButton");

if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {

        // Check if basket is empty
        if (basket.length === 0) {
            alert("Your basket is empty!");
            return;
        }

        // Go to the checkout page (the basket is already saved in localStorage)
        window.location.href = "checkout.html";

    });
}


/* =========================================
   7. CHECKOUT PAGE (checkout.html)
   ========================================= */

const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");
const placeOrderButton = document.getElementById("placeOrderButton");
const orderMessage = document.getElementById("orderMessage");

if (checkoutItems) {

    if (basket.length === 0) {

        checkoutItems.innerHTML = "<p>Your basket is empty.</p>";
        placeOrderButton.style.display = "none";

    } else {

        // Show each product of the basket
        basket.forEach(function (item) {

            const itemTotal = item.price * item.quantity;

            const checkoutItem = document.createElement("p");

            checkoutItem.textContent =
                item.name + " x " + item.quantity +
                " = €" + itemTotal.toFixed(2);

            checkoutItems.appendChild(checkoutItem);

        });

    }

    // Show the total
    checkoutTotal.textContent = "Total: €" + calculateTotal().toFixed(2);

    // Place the order
    placeOrderButton.addEventListener("click", function () {

        orderMessage.textContent =
            "Thank you! Your order of €" + calculateTotal().toFixed(2) +
            " has been placed.";

        // Empty the basket after the order
        basket = [];
        saveBasket();

        // Hide the products and the button
        checkoutItems.innerHTML = "";
        checkoutTotal.textContent = "";
        placeOrderButton.style.display = "none";

    });

}


/* =========================================
   8. REGISTRATION FORM (register.html)
   ========================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {

        // Stop the page from reloading
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // This variable remembers if the registration was correct
        let registerOk = false;

        // Send the data to the server
        fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })
            .then(function (response) {
                // response.ok is true when the registration is correct (status 200)
                registerOk = response.ok;
                return response.json();
            })
            .then(function (data) {
                // Show the message from the server
                document.getElementById("formMessage").textContent = data.message;

                // If the registration is correct, go to the login page after 2 seconds
                if (registerOk) {
                    setTimeout(function () {
                        window.location.href = "login.html";
                    }, 2000);
                }
            })
            .catch(function (error) {
                console.log(error);
                document.getElementById("formMessage").textContent =
                    "Unable to connect to server";
            });

    });
}


/* =========================================
   9. LOGIN FORM (login.html)
   ========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {

        // Stop the page from reloading
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // This variable remembers if the login was correct
        let loginOk = false;

        // Send the data to the server
        fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
            .then(function (response) {
                // response.ok is true when the login is correct (status 200)
                loginOk = response.ok;
                return response.json();
            })
            .then(function (data) {
                // Show the message from the server
                document.getElementById("formMessage").textContent = data.message;

                // If the login is correct, go to the products after 2 seconds
                if (loginOk) {
                    setTimeout(function () {
                        window.location.href = "services.html";
                    }, 2000);
                }
            })
            .catch(function (error) {
                console.log(error);
                document.getElementById("formMessage").textContent =
                    "Unable to connect to server";
            });

    });
}
