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

module.exports = router;// Get results for a student
router.get("/:studentId", (req, res) => {

    const { studentId } = req.params;

    try {

        const results = db.prepare(`
            SELECT
                student_id,
                subject,
                score
            FROM results
            WHERE student_id = ?
        `).all(studentId);

        if (results.length === 0) {

            return res.status(404).json({
                error: "No result found for this student."
            });

        }

        res.json({
            studentId,
            results
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to retrieve result."
        });
    }
});

