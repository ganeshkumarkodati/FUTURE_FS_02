const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let db;

// Function to initialize DB and THEN start the server
async function initialize() {
    db = await open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            studentId TEXT,
            name TEXT,
            email TEXT,
            attendance INTEGER,
            feesStatus TEXT,
            performance TEXT
        )
    `);
    
    console.log("✅ SQLite Database is Ready!");

    // START THE SERVER HERE
    app.listen(PORT, () => {
        console.log(`🚀 Backend is LIVE at http://localhost:${PORT}`);
        console.log(`📡 KEEP THIS WINDOW OPEN - Do not close!`);
    });
}

// GET: Fetch all students
app.get('/api/leads', async (req, res) => {
    try {
        const students = await db.all('SELECT * FROM students');
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Save a student
app.post('/api/leads', async (req, res) => {
    const { studentId, name, email, attendance, feesStatus, performance } = req.body;
    try {
        const result = await db.run(
            'INSERT INTO students (studentId, name, email, attendance, feesStatus, performance) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, name, email, attendance, feesStatus, performance]
        );
        console.log("✅ Student Saved to SQLite:", name);
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (err) {
        console.error("❌ DB Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// RUN THE INITIALIZATION
initialize();