// 🚀 Run after page loads
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("formMessage");

    if (!form) {
        console.error("Form not found ❌");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const location = document.getElementById("location").value.trim();
        const requirement = document.getElementById("requirement").value.trim();

        msg.innerHTML = "";

        // Validation
        if (!name || !phone || !location || !requirement) {
            msg.innerHTML = `<span style="color:red;">⚠ Fill all required fields</span>`;
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            msg.innerHTML = `<span style="color:red;">⚠ Invalid email format</span>`;
            return;
        }

        btn.disabled = true;
        btn.innerText = "Opening WhatsApp...";

        // Correct WhatsApp number with country code (India: 91)
        const whatsappNumber = "917439698978";
        const whatsappMessage = `Hello!%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ALocation: ${encodeURIComponent(location)}%0ARequirement: ${encodeURIComponent(requirement)}`;
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        // Open WhatsApp in new tab
        window.open(whatsappURL, "_blank");

        msg.innerHTML = `<span style="color:green;">✅ WhatsApp ready! Please send your message.</span>`;

        form.reset();
        btn.disabled = false;
        btn.innerText = "Send Message";
    });
});

// 📍 AUTO LOCATION FUNCTION
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
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const data = await response.json();
                    locationInput.value = data.display_name;
                } catch {
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