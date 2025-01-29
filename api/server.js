const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');
const passport = require('passport');
const LDAPStrategy = require('passport-ldapauth').Strategy;
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const config = {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Use encryption if required
        trustServerCertificate: true // Allow self-signed certificates
    }
};

// Connect to the database
sql.connect(config, err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected.');
});

// API to get the queue
app.get('/api/queue', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM queue');
        res.send(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send({ error: 'Error fetching data' });
    }
});

// API to get statistics
app.get('/api/statistic', async (req, res) => {
    const { start_date, end_date } = req.query;
    
    let query = 'SELECT * FROM statistic';
    
    if (start_date && end_date) {
        query += ` WHERE date BETWEEN '${start_date}' AND '${end_date}'`;
    }

    try {
        const result = await sql.query(query);
        res.send(result.recordset);
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).send({ error: 'Error fetching statistics' });
    }
});


// API to add a new entry to the queue
app.post('/api/queue', async (req, res) => {
    const { visitor_name, ticket_number, Time, helping_now, served, analyst_name } = req.body;
    const sqlQuery = `INSERT INTO queue (visitor_name, ticket_number, Time, helping_now, served, analyst_name) 
                      VALUES (@visitor_name, @ticket_number, @Time, @helping_now, @served, @analyst_name)`;

    try {
        const request = new sql.Request();
        request.input('visitor_name', sql.NVarChar, visitor_name);
        request.input('ticket_number', sql.NVarChar, ticket_number);
        request.input('Time', sql.DateTime, Time);
        request.input('helping_now', sql.Bit, helping_now);
        request.input('served', sql.Bit, served);
        request.input('analyst_name', sql.NVarChar, analyst_name); // Add analyst_name
        await request.query(sqlQuery);
        res.status(201).send({ success: true });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send({ error: 'Error inserting data' });
    }
});

// API to update queue status
app.put('/api/queue/:id', async (req, res) => {
    const { id } = req.params;
    const { helping_now, served, analyst_name } = req.body;
    const sqlQuery = `UPDATE queue SET helping_now = @helping_now, served = @served, analyst_name = @analyst_name WHERE id = @id`;

    try {
        const request = new sql.Request();
        request.input('helping_now', sql.Bit, helping_now);
        request.input('served', sql.Bit, served);
        request.input('analyst_name', sql.NVarChar, analyst_name); // Add analyst_name
        request.input('id', sql.Int, id);
        await request.query(sqlQuery);
        res.send({ success: true });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send({ error: 'Error updating data' });
    }
});

// API to reset the queue daily
app.post('/api/reset', async (req, res) => {
    const currentDate = new Date();
    try {
        // Get the details of tickets for each analyst
        const result = await sql.query(`
            SELECT analyst_name, visitor_name, ticket_number
            FROM queue
        `);

        const deleteQueueQuery = 'DELETE FROM queue';
        const deleteResponsesQuery = 'DELETE FROM responses';

        // Insert each record into the statistic table
        const insertQuery = `
            INSERT INTO statistic (date, ritm_count, inc_count, noticket_count, analyst_name, visitor_name, ticket_number)
            VALUES (@date, @ritm_count, @inc_count, @noticket_count, @analyst_name, @visitor_name, @ticket_number)
        `;

        for (const row of result.recordset) {
            const { analyst_name, visitor_name, ticket_number } = row;

            let ritmCount = 0;
            let incCount = 0;
            let noticketCount = 0;

            if (ticket_number.startsWith('RITM')) {
                ritmCount = 1;
            } else if (ticket_number.startsWith('INC')) {
                incCount = 1;
            } else {
                noticketCount = 1;
            }

            const request = new sql.Request();
            request.input('date', sql.DateTime, currentDate);
            request.input('ritm_count', sql.Int, ritmCount);
            request.input('inc_count', sql.Int, incCount);
            request.input('noticket_count', sql.Int, noticketCount);
            request.input('analyst_name', sql.NVarChar, analyst_name);
            request.input('visitor_name', sql.NVarChar, visitor_name);
            request.input('ticket_number', sql.NVarChar, ticket_number);

            await request.query(insertQuery);
        }

        // Clear the queue and responses for reset
        await sql.query(deleteQueueQuery);
        await sql.query(deleteResponsesQuery);

        res.send({ success: true });
    } catch (err) {
        console.error('Error resetting data:', err);
        res.status(500).send({ error: 'Error resetting data' });
    }
});



app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false, cookie: { secure: false } }));
app.use(passport.initialize());
app.use(passport.session());

// Configure LDAP authentication strategy
const ldapOptions = {
    server: {
        url: 'ldap://10.84.132.3',
        bindDN: 'CN=LDAP Authentication,OU=BIO,OU=NA,OU=UserAccounts,DC=agc,DC=jp', // Replace with your admin DN
        bindCredentials: 'H41ry!C4t', // Replace with your admin password
        searchBase: 'OU=CPH,OU=DK,OU=BIO,OU=NA,OU=UserAccounts,DC=agc,DC=jp',
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
app.post('/api/login', (req, res, next) => {
    passport.authenticate('ldapauth', { session: true }, (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return res.status(500).json({ success: false, message: 'Authentication error', error: err });
        }
        if (!user) {
            console.warn('Authentication failed:', info.message);
            return res.status(401).json({ success: false, message: 'Authentication failed', error: info.message });
        }
        req.logIn(user, (loginErr) => {
            if (loginErr) {
                console.error('Login error:', loginErr);
                return res.status(500).json({ success: false, message: 'Login error', error: loginErr });
            }
            return res.json({ success: true, user: req.user });
        });
    })(req, res, next);
});

// Start the server
app.listen(port,'0.0.0.0', () => {
    console.log(`Server running on port http://0.0.0.0:${port}`);
});
