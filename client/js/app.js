const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        const loginMessage =
            document.getElementById("loginMessage");

        // MVP login credentials
        if (username === "teacher" && password === "1234") {

            loginMessage.textContent =
                "Login successful!";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);

        } else {

            loginMessage.textContent =
                "Invalid username or password.";

        }

    });

}


// Enter Result Form
const resultForm = document.getElementById("resultForm");

if (resultForm) {

    resultForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const studentId =
            document.getElementById("studentId").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const score =
            Number(document.getElementById("score").value);

        const resultMessage =
            document.getElementById("resultMessage");

        try {

            const response = await fetch("/api/results", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentId: studentId,
                    subject: subject,
                    score: score
                })

            });

            const result = await response.json();

            if (response.ok) {

                resultMessage.textContent =
                    result.message;

                resultForm.reset();

            } else {

                resultMessage.textContent =
                    result.error;

            }

        } catch (error) {

            console.error(error);

            resultMessage.textContent =
                "Unable to connect to the server.";

        }

    });

}
