const db = require("../database/database");

// Add a result
function addResult(req, res) {

    const {
        studentId,
        subject,
        score
    } = req.body;

    if (!studentId || !subject || score === undefined) {
        return res.status(400).json({
            error: "Student ID, subject and score are required."
        });
    }

    if (score < 0 || score > 100) {
        return res.status(400).json({
            error: "Score must be between 0 and 100."
        });
    }

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
            error: error.message
        });

    }
}

module.exports = {
    addResult
};
