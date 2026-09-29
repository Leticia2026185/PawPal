// Find the buttons
const dogButton = document.getElementById("dogButton");
const petButton = document.getElementById("petButton");
const homeButton = document.getElementById("homeButton");

// Find the message paragraphs
const dogMessage = document.getElementById("dogMessage");
const petMessage = document.getElementById("petMessage");
const homeMessage = document.getElementById("homeMessage");

// Show Dog Walking information when clicked
if (dogButton) {
    dogButton.addEventListener("click", function() {
        dogMessage.textContent = "Dog Walking helps keep your dog active and happy.";
    });
}

// Show Pet Sitting information when clicked
if (petButton) {
    petButton.addEventListener("click", function() {
        petMessage.textContent = "Pet Sitting provides care and company when you are away.";
    });
}

// Show Home Visits information when clicked
if (homeButton) {
    homeButton.addEventListener("click", function() {
        homeMessage.textContent = "Home Visits provide care and attention in your pet's home.";
    });
}


// Find the contact form
const contactForm = document.getElementById("contactForm");

// Check the form when it is submitted
if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Find the form fields
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        // Check if any field is empty
if (name === "" || phone === "" || email === "" || message === "") {
    alert("Please fill in all fields.");
    return;
}

// Check if the name contains only letters and spaces
const namePattern = /^[A-Za-z\s]+$/;

if (!namePattern.test(name)) {
    alert("Name can only contain letters and spaces.");
    return;
}

// Check if the phone contains only numbers
const phonePattern = /^[0-9]+$/;

if (!phonePattern.test(phone) || (phone.length !== 9 && phone.length !== 10)) {
    alert("Phone must contain 9 or 10 numbers.");
    return;
}

alert("Form submitted successfully!");

    });

}