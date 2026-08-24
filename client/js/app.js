const studentForm = document.getElementById("studentForm");

if (studentForm) {
    studentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const studentId = document.getElementById("studentId").value;
        const fullName = document.getElementById("fullName").value;
        const gender = document.getElementById("gender").value;
        const className = document.getElementById("className").value;
        const session = document.getElementById("session").value;
        const term = document.getElementById("term").value;

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
            const message = document.getElementById("message");

            if (response.ok) {
                message.textContent = data.message;
                studentForm.reset();
            } else {
                message.textContent =
                    data.error || "Unable to add student.";
            }

        } catch (error) {
            console.error(error);

            document.getElementById("message").textContent =
                "Unable to connect to the server.";
        }
    });
}
