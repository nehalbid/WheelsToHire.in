-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS car_rental;
USE car_rental;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS cars;

-- Create the cars table with the new structure
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    fuelType VARCHAR(20) NOT NULL,
    seats INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 