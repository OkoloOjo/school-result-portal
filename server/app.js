
const express = require("express");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const resultRoutes = require("./routes/results");

// Import database
require("./database/database");

const app = express();

const PORT = process.env.PORT || 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ========================================
// SERVE FRONTEND
// ========================================

app.use(
    express.static(
        path.join(__dirname, "..", "client")
    )
);


// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/students",
    studentRoutes
);

app.use(
    "/api/results",
    resultRoutes
);


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "..",
            "client",
            "login.html"
        )
    );

});


// ========================================
// 404 ERROR
// ========================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log(
        `School Result Portal running on port ${PORT}`
    );

});
