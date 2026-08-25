const express = require("express");

const router = express.Router();

const studentController =
    require("../controllers/studentController");


// Add student
router.post(
    "/",
    studentController.addStudent
);


// Get all students
router.get(
    "/",
    studentController.getStudents
);


// Get one student
router.get(
    "/:studentId",
    studentController.getStudent
);


module.exports = router;
