
const Database = require("better-sqlite3");
const path = require("path");

const databasePath = path.join(
    __dirname,
    "school.db"
);

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");


// ========================================
// STUDENTS TABLE
// ========================================

db.exec(`
    CREATE TABLE IF NOT EXISTS students (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        student_id TEXT NOT NULL UNIQUE,

        full_name TEXT NOT NULL,

        gender TEXT NOT NULL,

        class_name TEXT NOT NULL,

        session TEXT NOT NULL,

        term TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )
`);


// ========================================
// RESULTS TABLE
// ========================================

db.exec(`
    CREATE TABLE IF NOT EXISTS results (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        student_id TEXT NOT NULL,

        subject TEXT NOT NULL,

        score REAL NOT NULL,

        grade TEXT NOT NULL,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE

    )
`);


console.log("SQLite database connected.");


// Export database
module.exports = db;
