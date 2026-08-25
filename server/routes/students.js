const express = require("express");

const router = express.Router();

const studentController =
    require("../controllers/studentController");


// ========================================
// ADD STUDENT
// ========================================

router.post(
    "/",
    studentController.addStudent
);


// ========================================
// GET ALL STUDENTS
// ========================================

router.get(
    "/",
    studentController.getStudents
);


// ========================================
// GET ONE STUDENT
// ========================================

router.get(
    "/:studentId",
    studentController.getStudent
);


module.exports = router;
