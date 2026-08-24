const resultForm = document.getElementById("resultForm");
const studentIdInput = document.getElementById("studentId");
const resultMessage = document.getElementById("resultMessage");

if (resultForm) {

    resultForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const studentId = studentIdInput.value.trim();

        if (!studentId) {
            resultMessage.textContent = "Please enter your Student ID.";
            resultMessage.className = "error";
            return;
        }

        resultMessage.textContent = "Loading result...";
        resultMessage.className = "";

        try {

            const response = await fetch(`/api/results/${studentId}`);

            const data = await response.json();

            if (!response.ok) {
                resultMessage.textContent =
                    data.error || "Result not found.";

                resultMessage.className = "error";
                return;
            }

            resultMessage.innerHTML = `
                <h3>Result Found</h3>

                <p>
                    <strong>Student ID:</strong>
                    ${studentId}
                </p>

                <pre>${JSON.stringify(data, null, 2)}</pre>
            `;

        } catch (error) {

            console.error(error);

            resultMessage.textContent =
                "Unable to connect to the server.";

            resultMessage.className = "error";
        }
    });

}
