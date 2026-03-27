const BASE_URL = "https://website-backend-ye9m.onrender.com";

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    // Clear previous error
    errorMsg.innerText = "";

    if (!username || !password) {
        errorMsg.innerText = "⚠️ Enter both username and password";
        return;
    }

    fetch(`${BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(async res => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.message || "❌ Invalid username or password";
                throw new Error(msg);
            }
            return res.json();
        })
        .then(data => {
            // Optional: save a token if backend returns one
            // localStorage.setItem("adminToken", data.token);

            // ✅ SAVE LOGIN STATE
            localStorage.setItem("admin", "true");

            // ✅ REDIRECT TO DASHBOARD
            window.location.replace("admin.html");
        })
        .catch(err => {
            console.error("Login failed:", err);
            errorMsg.innerText = err.message;
        });
}