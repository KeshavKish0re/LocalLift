document.addEventListener("DOMContentLoaded", function () {

    console.log("JS is running 🚀");

    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("formMessage");

    if (!form) {
        console.error("Form not found ❌");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("Form submitted ✅");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        msg.innerHTML = "";

        if (!name || !email || !message) {
            msg.innerHTML = `<span style="color:red;">⚠ Fill all fields</span>`;
            return;
        }

        btn.innerText = "Sending...";
        btn.disabled = true;

        try {
            const response = await fetch("http://localhost:8080/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            });

            // ✅ CHECK IF RESPONSE IS SUCCESS
            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = await response.text();

            msg.innerHTML = `<span style="color:green;">✅ ${result}</span>`;

            // ✅ ALERT POPUP (you asked this)
            alert("✅ Message sent successfully!");

            form.reset();

        } catch (error) {
            msg.innerHTML = `<span style="color:red;">❌ Failed to send</span>`;
            console.error("Error:", error);
        }

        btn.innerText = "Send Message";
        btn.disabled = false;
    });

});