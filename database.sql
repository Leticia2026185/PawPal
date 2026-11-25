-- PawPal database
-- Run this file in MySQL Workbench to create the database and the tables

CREATE DATABASE IF NOT EXISTS pawpal;

USE pawpal;

-- Users table (registration and login)
-- The password column keeps the bcrypt hash, not the real password
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Products table (product catalogue)
-- The image column keeps the file name of the picture inside public/images
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(100) NOT NULL
);

-- Insert the 5 products
INSERT INTO products (name, description, price, image) VALUES
('Dog Food', 'Nutritious food for adult dogs', 25.99, 'dog-food.jpg'),
('Cat Food', 'Healthy food for cats', 18.50, 'cat-food.jpg'),
('Dog Toy', 'Fun toy for dogs', 8.99, 'dog-toy.jpg'),
('Pet Bed', 'Comfortable bed for pets', 32.00, 'pet-bed.jpg'),
('Pet Brush', 'Brush for dogs and cats', 12.50, 'pet-brush.jpg');

-- Check the data
SELECT * FROM users;
SELECT * FROM products;
