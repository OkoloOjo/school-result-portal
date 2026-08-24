const express = require("express");
const db = require("../database/database");

const router = express.Router();

// Add a result
router.post("/", (req, res) => {
    const {
        studentId,
        subject,
        score
    } = req.body;

    try {
        const statement = db.prepare(`
            INSERT INTO results
            (student_id, subject, score)
            VALUES (?, ?, ?)
        `);

        statement.run(
            studentId,
            subject,
            score
        );

        res.status(201).json({
            message: "Result added successfully!"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Unable to add result."
        });
    }
});

module.exports = router;
