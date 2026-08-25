const db = require("../database/database");


// ========================================
// ADD STUDENT
// ========================================

function addStudent(req, res) {

    const {
        studentId,
        name,
        className
    } = req.body;


    if (!studentId || !name || !className) {

        return res.status(400).json({
            message: "Student ID, name and class are required."
        });

    }


    try {

        const statement = db.prepare(`
            INSERT INTO students
            (student_id, name, class_name)
            VALUES (?, ?, ?)
        `);


        statement.run(
            studentId,
            name,
            className
        );


        res.status(201).json({

            message: "Student added successfully.",

            student: {
                studentId,
                name,
                className
            }

        });


    } catch (error) {

        console.error(error);


        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {

            return res.status(409).json({
                message: "Student ID already exists."
            });

        }


        res.status(500).json({
            message: "Failed to add student."
        });

    }

}


// ========================================
// GET ALL STUDENTS
// ========================================

function getStudents(req, res) {

    try {

        const students = db.prepare(`
            SELECT
                id,
                student_id,
                name,
                class_name,
                created_at
            FROM students
            ORDER BY name ASC
        `).all();


        res.json(students);


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to retrieve students."
        });

    }

}


// ========================================
// GET ONE STUDENT
// ========================================

function getStudent(req, res) {

    const {
        studentId
    } = req.params;


    try {

        const student = db.prepare(`
            SELECT
                id,
                student_id,
                name,
                class_name,
                created_at
            FROM students
            WHERE student_id = ?
        `).get(studentId);


        if (!student) {

            return res.status(404).json({
                message: "Student not found."
            });

        }


        res.json(student);


    } catch (error) {

        console.error(error);


        res.status(500).json({
            message: "Failed to retrieve student."
        });

    }

}


module.exports = {
    addStudent,
    getStudents,
    getStudent
};
