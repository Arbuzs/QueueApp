CREATE TABLE queue (
    id INT IDENTITY PRIMARY KEY,
    visitor_name VARCHAR(255),
    ticket_number VARCHAR(255),
    Time VARCHAR(255),
    helping_now BIT DEFAULT (0),
    served BIT DEFAULT (0));

CREATE TABLE statistic (
    id INT IDENTITY PRIMARY KEY,
    date DATE,
    ritm_count INT,
    inc_count INT
);
 
CREATE TABLE responses (
    id INT IDENTITY PRIMARY KEY,
    visitor_name VARCHAR(255),
    ticket_number VARCHAR(255)
);