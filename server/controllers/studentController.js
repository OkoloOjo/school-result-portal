const db = require("../database/database");


// ========================================
// ADD STUDENT
// ========================================

function addStudent(req, res) {

    const {
        studentId,
        fullName,
        gender,
        className,
        session,
        term
    } = req.body;


    if (
        !studentId ||
        !fullName ||
        !gender ||
        !className ||
        !session ||
        !term
    ) {

        return res.status(400).json({
            message: "All student fields are required."
        });

    }


    try {

        const statement = db.prepare(`
            INSERT INTO students
            (
                student_id,
                full_name,
                gender,
                class_name,
                session,
                term
            )
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

            message: "Student added successfully!",

            student: {
                studentId,
                fullName,
                gender,
                className,
                session,
                term
            }

        });


    } catch (error) {

        console.error(error);


        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {

            return res.status(409).json({

                message:
                    "A student with this ID already exists."

            });

        }


        res.status(500).json({

            message:
                "Unable to add student."

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
                full_name,
                gender,
                class_name,
                session,
                term,
                created_at

            FROM students

            ORDER BY full_name ASC
        `).all();


        res.json(students);


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Unable to retrieve students."

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
                full_name,
                gender,
                class_name,
                session,
                term,
                created_at

            FROM students

            WHERE student_id = ?
        `).get(studentId);


        if (!student) {

            return res.status(404).json({

                message:
                    "Student not found."

            });

        }


        res.json(student);


    } catch (error) {

        console.error(error);


        res.status(500).json({

            message:
                "Unable to retrieve student."

        });

    }

}


// ========================================
// EXPORT
// ========================================

module.exports = {

    addStudent,

    getStudents,

    getStudent

};
