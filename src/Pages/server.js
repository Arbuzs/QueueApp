const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const LDAPStrategy = require('passport-ldapauth').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'queue_management'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
});

// API to get the queue
app.get('/api/queue', (req, res) => {
    db.query('SELECT * FROM queue', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// API to add a new entry to the queue
app.post('/api/queue', (req, res) => {
    const { visitor_name, ticket_number, queue_number, Time, helping_now, served } = req.body;
    const sql = 'INSERT INTO queue (visitor_name, ticket_number, queue_number, Time, helping_now, served) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [visitor_name, ticket_number, queue_number, Time, helping_now, served], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).send({ error: 'Error inserting data' });
            return;
        }
        res.status(201).send({ success: true });
    });
});

// API to update queue status
app.put('/api/queue/:id', (req, res) => {
    const { id } = req.params;
    const { helping_now, served } = req.body;
    const sql = 'UPDATE queue SET helping_now = ?, served = ? WHERE id = ?';
    db.query(sql, [helping_now, served, id], (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send({ error: 'Error updating data' });
            return;
        }
        res.send({ success: true });
    });
});

// API to reset the queue daily
app.post('/api/reset', (req, res) => {
    const currentDate = new Date();
    db.query('SELECT ticket_number FROM queue', (err, results) => {
        if (err) throw err;
        let ritmCount = 0;
        let incCount = 0;

        results.forEach(row => {
            if (row.ticket_number.startsWith('RITM')) ritmCount++;
            if (row.ticket_number.startsWith('INC')) incCount++;
        });

        db.query('INSERT INTO statistics (date, ritm_count, inc_count) VALUES (?, ?, ?)', [currentDate, ritmCount, incCount], (err, result) => {
            if (err) throw err;
            db.query('DELETE FROM queue', err => {
                if (err) throw err;
                db.query('DELETE FROM responses', err => {
                    if (err) throw err;
                    res.send({ success: true });
                });
            });
        });
    });
});


app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false    , cookie: { secure: false }}));
app.use(passport.initialize());
app.use(passport.session());

// Configure LDAP authentication strategy
const ldapOptions = {
    server: {
        url: 'ldap://queueapp',
        bindDN: 'cn=admin,dc=example,dc=com', // Replace with your admin DN
        bindCredentials: 'admin-password', // Replace with your admin password
        searchBase: 'dc=example,dc=com',
        searchFilter: '(uid={{username}})' // Adjust this filter as per your LDAP schema
    }
};

passport.use(new LDAPStrategy(ldapOptions));

// Serialize and deserialize user instances to and from the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// API to log in using LDAP

app.post('/api/login', passport.authenticate('ldapauth', { session: true }), (req, res) => {
    res.json({ success: true, user: req.user });
});

// API to get the queue

app.get('/api/queue', (req, res) => {
    db.query('SELECT * FROM queue', (err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// The rest of your existing API routes go here...

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});