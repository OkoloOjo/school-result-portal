const express = require("express");
const db = require("../database/database");

const router = express.Router();

// Add a student
router.post("/", (req, res) => {
    const {
        studentId,
        fullName,
        gender,
        className,
        session,
        term
    } = req.body;

    try {
        const statement = db.prepare(`
            INSERT INTO students
            (student_id, full_name, gender, class_name, session, term)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        statement.run(
            studentId,
            fullName,
            gender,
            className,
            session,
            term
        );

        res.status(201).json({
            message: "Student added successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to add student."
        });
    }
});

module.exports = router;
