// 🚀 Run after page loads
document.addEventListener("DOMContentLoaded", function () {

    console.log("JS is running 🚀");

    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("formMessage");

    if (!form) {
        console.error("Form not found ❌");
        return;
    }

    // 🧠 Form Submit Handler
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // 🔥 Stops page refresh

        console.log("Form intercepted ✅");

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email")?.value.trim() || "";
        const location = document.getElementById("location").value.trim();
        const requirement = document.getElementById("requirement").value.trim();

        msg.innerHTML = "";

        // 🛡️ Validation
        if (!name || !phone || !location || !requirement) {
            msg.innerHTML = `<span style="color:red;">⚠ Fill all required fields</span>`;
            return;
        }

        // 📧 Email validation (only if provided)
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            msg.innerHTML = `<span style="color:red;">⚠ Invalid email format</span>`;
            return;
        }

        btn.innerText = "Sending...";
        btn.disabled = true;

        try {
            // ✅ Existing backend fetch
            const response = await fetch("http://localhost:8080/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: email,
                    location: location,
                    message: requirement
                })
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = await response.text();

            msg.innerHTML = `<span style="color:green;">✅ ${result}</span>`;
            alert("✅ Message sent successfully!");

            // 🟢 WhatsApp integration
            const whatsappNumber = "917439698978"; // Your number
            const whatsappMessage = `Hello!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ALocation: ${encodeURIComponent(location)}%0ARequirement: ${encodeURIComponent(requirement)}`;
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

            // Open WhatsApp in new tab
            window.open(whatsappURL, "_blank");

            form.reset();

        } catch (error) {
            console.error("Error:", error);
            msg.innerHTML = `<span style="color:red;">❌ Failed to send</span>`;
        }

        btn.innerText = "Send Message";
        btn.disabled = false;
    });

});

// 📍 AUTO LOCATION FUNCTION (Global)
function getLocation() {
    const locationInput = document.getElementById("location");

    if (!locationInput) return;

    if (navigator.geolocation) {
        locationInput.value = "Fetching location...";

        navigator.geolocation.getCurrentPosition(
            async function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );

                    const data = await response.json();
                    locationInput.value = data.display_name;

                } catch (error) {
                    locationInput.value = `Lat: ${lat}, Lon: ${lon}`;
                }
            },
            function () {
                locationInput.value = "Location access denied ❌";
            }
        );
    } else {
        locationInput.value = "Geolocation not supported ❌";
    }
}