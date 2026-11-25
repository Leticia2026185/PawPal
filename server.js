/* =========================================
   PAWPAL - SERVER (Node.js + Express)
   Handles registration, login and products.
   Start it with: node server.js
   ========================================= */

// Read the database settings from the .env file
require("dotenv").config();
// Express creates the web server
const express = require("express");
// mysql2 connects Node.js to the MySQL database
const mysql = require("mysql2");
// bcrypt creates and checks the password hash
const bcrypt = require("bcrypt");

// Create Express application
const app = express();

// Middleware
// express.json() reads the JSON sent by fetch() in script.js
app.use(express.json());
// The website files (HTML, CSS, JS, images) are inside the public folder
app.use(express.static("public"));

// Connect to MySQL using environment variables
// process.env reads the values from the .env file (the password is not in the code)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check MySQL connection
db.connect(function(error) {
    if (error) {
        console.log("Database connection failed:", error.message);
        return;
    }

    console.log("MySQL connected successfully");
});

// REGISTER ROUTE
// Runs when script.js sends POST /register with the form data
app.post("/register", function(req, res) {

    // req.body has the data sent by the browser
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    let email = req.body.email;
    const password = req.body.password;

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check the password length
    if (password.length < 8) {
        return res.status(400).json({ message: "Password must have at least 8 characters" });
    }

    // Save the email always in the same format
    email = email.trim().toLowerCase();

    // Check if email already exists
    // The ? is a placeholder: mysql2 puts the email there safely (protects against SQL injection)
    const checkEmail = "SELECT * FROM users WHERE email = ?";

    db.query(checkEmail, [email], function(error, results) {

        if (error) {
            console.log("Email check error:", error.message);
            return res.status(500).json({ message: "Database error" });
        }

        // If email already exists (status 409 = conflict)
        if (results.length > 0) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Hash the password for security
        // 10 is the number of salt rounds (how many times bcrypt mixes the password)
        bcrypt.hash(password, 10, function(error, hashedPassword) {

            if (error) {
                return res.status(500).json({ message: "Error encrypting password" });
            }

            // Insert user into database
            const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

            db.query(sql, [firstName.trim(), lastName.trim(), email, hashedPassword], function(error, result) {

                if (error) {
                    console.log("Registration error:", error.message);
                    return res.status(500).json({ message: "Error creating account" });
                }

                // Status 200 (OK) is sent by default
                res.json({ message: "Account created successfully! Please login." });

            });
        });

    });

});

// LOGIN ROUTE
// Runs when script.js sends POST /login with email and password
app.post("/login", function(req, res) {

    let email = req.body.email;
    const password = req.body.password;

    // Check if fields are filled
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter email and password" });
    }

    // Remove spaces and use small letters, the same as in the register route
    email = email.trim().toLowerCase();

    // Search for user by email
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], function(error, results) {

        if (error) {
            console.log("Login error:", error.message);
            return res.status(500).json({ message: "Database error" });
        }

        // Check if user exists (status 401 = not authorised)
        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // results is an array, the user is the first (and only) row
        const user = results[0];

        // Compare password with stored hash
        // bcrypt hashes the typed password again and compares the two hashes
        bcrypt.compare(password, user.password, function(error, result) {

            if (error) {
                return res.status(500).json({ message: "Error checking password" });
            }

            if (!result) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            res.json({ message: "Login successful! Welcome " + user.first_name });

        });

    });

});

// PRODUCTS ROUTE
// Runs when script.js calls fetch("/products")
app.get("/products", function(req, res) {

    console.log("GET /products received");

    let sql = "SELECT * FROM products";

    db.query(sql, function(error, results) {

        if (error) {
            console.log("Error:", error.message);

            return res.status(500).json({
                message: "Error retrieving products"
            });
        }

        // Send the products to the browser in JSON format
        res.json(results);
    });
});

// Start server on port 3000 (open http://localhost:3000)
app.listen(3000, function() {
    console.log("Server running at http://localhost:3000");
});
