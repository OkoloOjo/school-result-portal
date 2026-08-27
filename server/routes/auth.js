const express = require("express");

const router = express.Router();

router.post("/login", (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;


    if (!username || !password || !role) {

        return res.status(400).json({
            message: "Username, password and role are required."
        });

    }


    // Temporary teacher account
    if (
        username === "teacher" &&
        password === "1234" &&
        role === "teacher"
    ) {

        return res.json({

            message: "Teacher login successful.",

            user: {
                username: "teacher",
                role: "teacher"
            }

        });

    }


    // Temporary student account
    if (
        username === "student" &&
        password === "1234" &&
        role === "student"
    ) {

        return res.json({

            message: "Student login successful.",

            user: {
                username: "student",
                role: "student"
            }

        });

    }


    return res.status(401).json({
        message: "Invalid username, password or role."
    });

});
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client("184102525492-61u1ham3hio96rpkj3ga1uve3psrolsb.apps.googleusercontent.com");

const TEACHER_EMAILS = [
    "okoloojonugwa155@gmail.com"
];
];

router.post("/google-login", async (req, res) => {

    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "184102525492-61u1ham3hio96rpkj3ga1uve3psrolsb.apps.googleusercontent.com"
        });

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        const role = TEACHER_EMAILS.includes(email) ? "teacher" : "student";

        return res.json({
            message: "Google login successful.",
            user: { username: name, email, role }
        });

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid Google token." });
    }
});

module.exports = router;
