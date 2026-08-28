
    /*
    ========================================
    GET CURRENT PAGE
    ========================================
    */

document.addEventListener("DOMContentLoaded", function () {


    const currentPage =
        window.location.pathname.split("/").pop();


    
    function handleGoogleLogin(response) {

    const loginMessage = document.getElementById("loginMessage");

    loginMessage.innerHTML = "<p>Logging in with Google...</p>";

    fetch("/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential })
    })
    .then(res => res.json())
    .then(data => {

        if (!data.user) {
            loginMessage.innerHTML =
                `<p style="color:red;">${data.message || "Google login failed."}</p>`;
            return;
        }

        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role === "teacher") {
            window.location.href = "dashboard.html";
        } else {
            window.location.href = "student-result.html";
        }

    })
    .catch(error => {
        console.error(error);
        loginMessage.innerHTML =
            "<p style='color:red;'>Unable to connect to the server.</p>";
    });

}
    ========================================
    LOGIN PAGE
    ========================================
    */

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        const loginMessage =
            document.getElementById("loginMessage");


        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();


            const username =
                document.getElementById("username").value.trim();

            const password =
                document.getElementById("password").value.trim();

            const role =
                document.getElementById("role").value;


            if (!username || !password || !role) {

                loginMessage.innerHTML =
                    "<p style='color:red;'>Please fill in all fields.</p>";

                return;
            }


            loginMessage.innerHTML =
                "<p>Logging in...</p>";


            try {

                const response = await fetch("/api/auth/login", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password,
                        role
                    })

                });


                const data =
                    await response.json();


                if (!response.ok) {

                    loginMessage.innerHTML =
                        `<p style="color:red;">
                            ${data.message || "Login failed."}
                        </p>`;

                    return;
                }


                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                if (role === "teacher") {

    
window.location.href = "dashboard.html";
} else {

    
window.location.href = "student-result.html";
}


            } catch (error) {

                console.error(error);

                loginMessage.innerHTML =
                    "<p style='color:red;'>Unable to connect to the server.</p>";

            }

        });

    }


    /*
    ========================================
    DASHBOARD PAGE
    ========================================
    */

    const logoutButton =
        document.getElementById("logoutButton");


    if (logoutButton) {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            window.location.href =
                "login.html";

            return;
        }


        let user;


        try {

            user =
                JSON.parse(savedUser);

        } catch (error) {

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;
        }


        if (user.role !== "teacher") {

            window.location.href =
                "result.html";

            return;
        }


        const welcomeMessage =
            document.getElementById("welcomeMessage");


        const studentCount =
            document.getElementById("studentCount");


        const resultCount =
            document.getElementById("resultCount");


        if (welcomeMessage) {

            welcomeMessage.textContent =
                `Welcome, ${user.username}`;

        }


        async function loadDashboardData() {

            try {

                const studentResponse =
                    await fetch("/api/students");


                if (studentResponse.ok) {

                    const students =
                        await studentResponse.json();


                    if (studentCount) {

                        studentCount.textContent =
                            Array.isArray(students)
                                ? students.length
                                : 0;

                    }

                }


                const resultResponse =
                    await fetch("/api/results");


                if (resultResponse.ok) {

                    const results =
                        await resultResponse.json();


                    if (resultCount) {

                        resultCount.textContent =
                            Array.isArray(results)
                                ? results.length
                                : 0;

                    }

                }


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

            }

        }


        loadDashboardData();


        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem("user");

                window.location.href =
                    "login.html";

            }
        );

    }


    /*
    ========================================
    ADD RESULT PAGE
    ========================================
    */

    const resultForm =
        document.getElementById("resultForm");


    if (resultForm) {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            window.location.href =
                "login.html";

            return;
        }


        let user;


        try {

            user =
                JSON.parse(savedUser);

        } catch (error) {

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;
        }


        if (user.role !== "teacher") {

            window.location.href =
                "result.html";

            return;
        }


        const resultMessage =
            document.getElementById("resultMessage");


        resultForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const studentId =
                    document
                        .getElementById("studentId")
                        .value
                        .trim();


                const studentName =
                    document
                        .getElementById("studentName")
                        .value
                        .trim();


                const subject =
                    document
                        .getElementById("subject")
                        .value
                        .trim();


                const score =
                    Number(
                        document
                            .getElementById("score")
                            .value
                    );


                if (
                    !studentId ||
                    !studentName ||
                    !subject
                ) {

                    resultMessage.innerHTML =
                        "<p style='color:red;'>Please fill in all fields.</p>";

                    return;
                }


                if (
                    Number.isNaN(score) ||
                    score < 0 ||
                    score > 100
                ) {

                    resultMessage.innerHTML =
                        "<p style='color:red;'>Score must be between 0 and 100.</p>";

                    return;
                }


                resultMessage.innerHTML =
                    "<p>Saving result...</p>";


                try {

                    const response =
                        await fetch("/api/results", {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                studentId,
                                studentName,
                                subject,
                                score
                            })

                        });


                    const data =
                        await response.json();


                    if (!response.ok) {

                        resultMessage.innerHTML =
                            `<p style="color:red;">
                                ${data.message || "Failed to save result."}
                            </p>`;

                        return;
                    }


                    resultMessage.innerHTML =
                        "<p style='color:green;'>Result saved successfully!</p>";


                    resultForm.reset();


                } catch (error) {

                    console.error(error);

                    resultMessage.innerHTML =
                        "<p style='color:red;'>Unable to connect to the server.</p>";

                }

            }
        );

    }


    /*
    ========================================
    STUDENT RESULT PAGE
    ========================================
    */

    const studentResultForm =
        document.getElementById("studentResultForm");


    if (studentResultForm) {

        const resultMessage =
            document.getElementById("resultMessage");


        const resultContainer =
            document.getElementById("resultContainer");


        const studentDetails =
            document.getElementById("studentDetails");


        const resultTable =
            document.getElementById("resultTable");


        const resultSummary =
            document.getElementById("resultSummary");


        const printResult =
            document.getElementById("printResult");


        studentResultForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const studentId =
                    document
                        .getElementById("studentId")
                        .value
                        .trim();


                if (!studentId) {

                    resultMessage.innerHTML =
                        "<p style='color:red;'>Please enter your Student ID.</p>";

                    return;
                }


                resultMessage.innerHTML =
                    "<p>Loading result...</p>";


                resultContainer.style.display =
                    "none";


                try {

                    const response =
                        await fetch(
                            `/api/results/student/${encodeURIComponent(studentId)}`
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        resultMessage.innerHTML =
                            `<p style="color:red;">
                                ${data.message || "Result not found."}
                            </p>`;

                        return;
                    }


                    const results =
                        data.results || [];


                    if (results.length === 0) {

                        resultMessage.innerHTML =
                            "<p style='color:red;'>No result found.</p>";

                        return;
                    }


                    const student =
                        data.student || {};


                    studentDetails.innerHTML = `
                        <p>
                            <strong>Student ID:</strong>
                            ${student.studentId || studentId}
                        </p>

                        <p>
                            <strong>Student Name:</strong>
                            ${student.name || "Student"}
                        </p>

                        <p>
                            <strong>Class:</strong>
                            ${student.className || "N/A"}
                        </p>
                    `;


                    let tableHTML = `

                        <table style="
                            width:100%;
                            border-collapse:collapse;
                            margin-top:20px;
                        ">

                            <thead>

                                <tr>

                                    <th style="
                                        border:1px solid #ccc;
                                        padding:10px;
                                    ">
                                        Subject
                                    </th>

                                    <th style="
                                        border:1px solid #ccc;
                                        padding:10px;
                                    ">
                                        Score
                                    </th>

                                    <th style="
                                        border:1px solid #ccc;
                                        padding:10px;
                                    ">
                                        Grade
                                    </th>

                                </tr>

                            </thead>

                            <tbody>
                    `;


                    results.forEach(function (result) {

                        tableHTML += `

                            <tr>

                                <td style="
                                    border:1px solid #ccc;
                                    padding:10px;
                                ">
                                    ${result.subject}
                                </td>

                                <td style="
                                    border:1px solid #ccc;
                                    padding:10px;
                                    text-align:center;
                                ">
                                    ${result.score}
                                </td>

                                <td style="
                                    border:1px solid #ccc;
                                    padding:10px;
                                    text-align:center;
                                ">
                                    ${result.grade}
                                </td>

                            </tr>

                        `;

                    });


                    tableHTML += `

                            </tbody>

                        </table>

                    `;


                    resultTable.innerHTML =
                        tableHTML;


                    const total =
                        data.summary
                            ? data.summary.total
                            : results.reduce(
                                (sum, result) =>
                                    sum + Number(result.score),
                                0
                            );


                    const average =
                        data.summary
                            ? data.summary.average
                            : total / results.length;


            const grade =
    data.summary
        ? data.summary.grade
        : "N/A";


                    resultSummary.innerHTML = `

                        <div style="
                            margin-top:20px;
                            padding:15px;
                            background:#f4f7f6;
                            border-radius:6px;
                        ">

                            <p>
                                <strong>Total Score:</strong>
                                ${total}
                            </p>

                            <p>
                                <strong>Average:</strong>
                                ${Number(average).toFixed(2)}
                            </p>

                            <p>
                                <strong>Overall Grade:</strong>
                                ${grade}
                            </p>

                        </div>

                    `;


                    resultMessage.innerHTML =
                        "<p style='color:green;'>Result loaded successfully.</p>";


                    resultContainer.style.display =
                        "block";


                } catch (error) {

                    console.error(error);

                    resultMessage.innerHTML =
                        "<p style='color:red;'>Unable to connect to the server.</p>";

                }

            }
        );


        if (printResult) {

            printResult.addEventListener(
                "click",
                function () {

                    window.print();

                }
            );

        }

    }
/*
========================================
ADD STUDENT PAGE
========================================
*/

const studentForm =
    document.getElementById("studentForm");


if (studentForm) {

    const message =
        document.getElementById("message");


    studentForm.addEventListener(
        "submit",
        async function (event) {

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


            if (!studentId || !fullName || !gender || !className || !session || !term) {

                message.innerHTML =
                    "<p style='color:red;'>Please fill in all fields.</p>";

                return;
            }


            message.innerHTML =
                "<p>Saving student...</p>";


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


                if (!response.ok) {

                    message.innerHTML =
                        `<p style="color:red;">${data.message || "Failed to add student."}</p>`;

                    return;
                }


                message.innerHTML =
                    "<p style='color:green;'>Student added successfully!</p>";


                studentForm.reset();


            } catch (error) {

                console.error(error);

                message.innerHTML =
                    "<p style='color:red;'>Unable to connect to the server.</p>";

            }

        }
    );

}

    /*
    ========================================
    GRADE FUNCTION
    ========================================
    */

    function calculateGrade(score) {

        if (score >= 70) {
            return "A";
        }

        if (score >= 60) {
            return "B";
        }

        if (score >= 50) {
            return "C";
        }

        if (score >= 45) {
            return "D";
        }

        if (score >= 40) {
            return "E";
        }

        return "F";
    }

});
