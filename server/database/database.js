const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const databasePath = path.join(__dirname, "school.db");

const db = new DatabaseSync(databasePath);

// Students table
db.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        gender TEXT NOT NULL,
        class_name TEXT NOT NULL,
        session TEXT NOT NULL,
        term TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

// Results table
db.exec(`
    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        subject TEXT NOT NULL,
        score REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
