

const express = require("express");
const path = require("path");

const studentsRouter = require("./routes/students");
const resultsRouter = require("./routes/results");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow JSON requests
app.use(express.json());

// Serve frontend from public folder
app.use(express.static(path.join(__dirname, "../public")));

// Student API
app.use("/api/students", studentsRouter);

// Results API
app.use("/api/results", resultsRouter);

// Home page
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public", "index.html")
    );
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`School Result Portal running on port ${PORT}`);
});
