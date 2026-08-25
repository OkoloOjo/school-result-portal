const express = require("express");

const router = express.Router();

const resultController =
    require("../controllers/resultController");


// Add result
router.post(
    "/",
    resultController.addResult
);


// Get all results
router.get(
    "/",
    resultController.getResults
);


// Get results for one student
router.get(
    "/student/:studentId",
    resultController.getStudentResults
);


module.exports = router;
