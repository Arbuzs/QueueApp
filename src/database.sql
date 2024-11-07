CREATE DATABASE IF NOT EXISTS queue_management;

USE queue_management;

CREATE TABLE queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_number INT NOT NULL,
    visitor_name VARCHAR(255),
    ticket_number VARCHAR(255),
    Time VARCHAR(255),
    helping_now BOOLEAN DEFAULT FALSE,
    served BOOLEAN DEFAULT FALSE
);

CREATE TABLE statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    ritm_count INT,
    inc_count INT
);

CREATE TABLE responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(255),
    ticket_number VARCHAR(255)
);
 