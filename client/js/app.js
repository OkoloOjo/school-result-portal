// ========================================
// ADD STUDENT
// ========================================

const studentForm = document.getElementById("studentForm");

if (studentForm) {

    studentForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const studentId =
            document.getElementById("studentId").value.trim();

        const fullName =
            document.getElementById("fullName").value.trim();

        const gender =
            document.getElementById("gender").value;

        const className =
            document.getElementById("className").value;

        const session =
            document.getElementById("session").value.trim();

        const term =
            document.getElementById("term").value;

        const message =
            document.getElementById("message");

        try {

            const response = await fetch("/api/students", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentId,
                    fullName,
                    gender,
                    className,
                    session,
                    term
                })

            });

            const data = await response.json();

            if (response.ok) {

                message.textContent =
                    data.message || "Student added successfully!";

                message.className = "success";

                studentForm.reset();

            } else {

                message.textContent =
                    data.error || "Unable to add student.";

                message.className = "error";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

            message.className = "error";
        }
    });
}


// ========================================
// ADD RESULT
// ========================================

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

        // Check score

        if (score < 0 || score > 100) {

            resultMessage.textContent =
                "Score must be between 0 and 100.";

            resultMessage.className = "error";

            return;
        }

        try {

            const response = await fetch("/api/results", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    studentId,
                    subject,
                    score
                })

            });

            const data = await response.json();

            if (response.ok) {

                resultMessage.textContent =
                    data.message || "Result saved successfully!";

                resultMessage.className = "success";

                resultForm.reset();

            } else {

                resultMessage.textContent =
                    data.error || "Unable to save result.";

                resultMessage.className = "error";
            }


        } catch (error) {

            console.error(error);

            resultMessage.textContent =
                "Unable to connect to the server.";

            resultMessage.className = "error";
        }
    });
}
