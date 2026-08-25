

        const db = require("../database/database");


// ========================================
// CALCULATE GRADE
// ========================================

function calculateGrade(score) {

    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";

    return "F";
}


// ========================================
// ADD RESULT
// ========================================

function addResult(req, res) {

    const {
        studentId,
        studentName,
        subject,
        score
    } = req.body;


    if (!studentId || !subject || score === undefined) {

        return res.status(400).json({
            message: "Student ID, subject and score are required."
        });

    }


    const numericScore = Number(score);


    if (
        Number.isNaN(numericScore) ||
        numericScore < 0 ||
        numericScore > 100
    ) {

        return res.status(400).json({
            message: "Score must be between 0 and 100."
        });

    }


    try {

        let student = db.prepare(`
            SELECT *
            FROM students
            WHERE student_id = ?
        `).get(studentId);


        // Create student if not found
        if (!student) {

            if (!studentName) {

                return res.status(404).json({
                    message: "Student not found."
                });

            }


            const insertStudent = db.prepare(`
                INSERT INTO students
                (student_id, name, class_name)
                VALUES (?, ?, ?)
            `);


            insertStudent.run(
                studentId,
                studentName,
                "Not assigned"
            );


            student = db.prepare(`
                SELECT *
                FROM students
                WHERE student_id = ?
            `).get(studentId);

        }


        const grade =
            calculateGrade(numericScore);


        const statement = db.prepare(`
            INSERT INTO results
            (student_id, subject, score, grade)
            VALUES (?, ?, ?, ?)
        `);


        const result =
            statement.run(
                studentId,
                subject,
                numericScore,
                grade
            );


        res.status(201).json({

            message: "Result added successfully.",

            result: {
                id: result.lastInsertRowid,
                studentId,
                studentName: student.name,
                subject,
                score: numericScore,
                grade
            }

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to save result."
        });

    }

}


// ========================================
// GET ALL RESULTS
// ========================================

function getResults(req, res) {

    try {

        const results = db.prepare(`
            SELECT
                results.id,
                results.student_id,
                students.name AS student_name,
                students.class_name,
                results.subject,
                results.score,
                results.grade
            FROM results

            LEFT JOIN students
            ON results.student_id = students.student_id

            ORDER BY students.name ASC
        `).all();


        res.json(results);


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to retrieve results."
        });

    }

}


// ========================================
// GET STUDENT RESULTS
// ========================================

function getStudentResults(req, res) {

    const {
        studentId
    } = req.params;


    try {

        const results = db.prepare(`
            SELECT
                results.id,
                results.student_id,
                students.name AS student_name,
                students.class_name,
                results.subject,
                results.score,
                results.grade
            FROM results

            LEFT JOIN students
            ON results.student_id = students.student_id

            WHERE results.student_id = ?

            ORDER BY results.subject ASC
        `).all(studentId);


        if (results.length === 0) {

            return res.status(404).json({
                message: "No results found for this student."
            });

        }


        const total = results.reduce(
            (sum, result) =>
                sum + Number(result.score),
            0
        );


        const average =
            total / results.length;


        const overallGrade =
            calculateGrade(average);


        res.json({

            student: {
                studentId,
                name: results[0].student_name,
                className: results[0].class_name
            },

            results,

            summary: {
                total,
                average: Number(
                    average.toFixed(2)
                ),
                grade: overallGrade
            }

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to retrieve student results."
        });

    }

}


module.exports = {
    addResult,
    getResults,
    getStudentResults
};
