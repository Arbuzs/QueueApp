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
    server: 'dkcphbiodbc1_14.agc.jp',
    user: 'sd_queue',
    password: '!]r5LAK}8)pkQQRT>GzA5sho68~q%n',
    database: 'queue_management',
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

// API to add a new entry to the queue
app.post('/api/queue', async (req, res) => {
    const { visitor_name, ticket_number, Time, helping_now, served } = req.body;
    const sqlQuery = `INSERT INTO queue (visitor_name, ticket_number, Time, helping_now, served) 
                      VALUES (@visitor_name, @ticket_number, @Time, @helping_now, @served)`;

    try {
        const request = new sql.Request();
        request.input('visitor_name', sql.NVarChar, visitor_name);
        request.input('ticket_number', sql.NVarChar, ticket_number);
        // request.input('queue_number', sql.Int, queue_number);
        request.input('Time', sql.DateTime, Time);
        request.input('helping_now', sql.Bit, helping_now);
        request.input('served', sql.Bit, served);
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
    const { helping_now, served } = req.body;
    const sqlQuery = `UPDATE queue SET helping_now = @helping_now, served = @served WHERE id = @id`;

    try {
        const request = new sql.Request();
        request.input('helping_now', sql.Bit, helping_now);
        request.input('served', sql.Bit, served);
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
        const result = await sql.query('SELECT ticket_number FROM queue');
        let ritmCount = 0;
        let incCount = 0;
        let noticket = 0; 

        result.recordset.forEach(row => {
            if (row.ticket_number.startsWith('RITM')) ritmCount++;
            if (row.ticket_number.startsWith('INC')) incCount++;
            else noticket++;
        });

        const insertQuery = `INSERT INTO statistic (date, ritm_count, inc_count,noticket_count) VALUES (@date, @ritm_count, @inc_count, @noticket_count)`;
        const deleteQueueQuery = 'DELETE FROM queue';
        const deleteResponsesQuery = 'DELETE FROM responses';

        const request = new sql.Request();
        request.input('date', sql.DateTime, currentDate);
        request.input('ritm_count', sql.Int, ritmCount);
        request.input('inc_count', sql.Int, incCount);
        request.input('noticket_count', sql.Int, noticket);

        await request.query(insertQuery);
        await request.query(deleteQueueQuery);
        await request.query(deleteResponsesQuery);

        res.send({ success: true });
    } catch (err) {
        console.error('Error resetting data:', err);
        res.status(500).send({ error: 'Error resetting data' });
    }
});

app.use(bodyParser.json());
app.use(cors());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false , cookie: { secure: false }}));
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


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});