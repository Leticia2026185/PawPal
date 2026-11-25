
 // Import Express and MySQL
 require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

// Create Express application
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Connect to MySQL using environment variables
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
app.post("/register", function(req, res) {

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    // Check if all fields are filled
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send("Please fill in all fields");
    }

    // Check if email already exists
    const checkEmail = "SELECT * FROM users WHERE email = ?";

    db.query(checkEmail, [email], function(error, results) {

        if (error) {
            console.log("Email check error:", error.message);
            return res.status(500).send("Database error");
        }

        // If email already exists
        if (results.length > 0) {
            return res.status(400).send("Email already registered");
        }

        // Hash the password for security
        bcrypt.hash(password, 10, function(error, hashedPassword) {

            if (error) {
                return res.status(500).send("Error encrypting password");
            }

            // Insert user into database
            const sql = "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

            db.query(sql, [firstName, lastName, email, hashedPassword], function(error, result) {

                if (error) {
                    console.log("Registration error:", error.message);
                    return res.status(500).send("Error creating account");
                }

                res.send("Account created successfully!");

            });
        });

    });

});
// LOGIN ROUTE
console.log("LOGIN ROUTE LOADED");
app.post("/login", function(req, res) {
    console.log("LOGIN REQUEST RECEIVED");
    console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;

    // Check if fields are filled
    if (!email || !password) {
        return res.status(400).send("Please enter email and password");
    }

    // Search for user by email
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], function(error, results) {

        if (error) {
            console.log("Login error:", error.message);
            return res.status(500).send("Database error");
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).send("Invalid email or password");
        }

        const user = results[0];

        // Compare password with stored hash
        bcrypt.compare(password, user.password, function(error, result) {

            if (error) {
                return res.status(500).send("Error checking password");
            }

            if (!result) {
                return res.status(401).send("Invalid email or password");
            }

            res.redirect("/");

        });

    });

});
// PRODUCTS ROUTE
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

        res.json(results);
    });
});

// Start server
app.listen(3000, function() {
    console.log("Server running at http://localhost:3000");
});
