<script>
    document.addEventListener("DOMContentLoaded", function () {

        console.log("JS is running 🚀");

    const form = document.getElementById("contactForm");
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("formMessage");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();
    const requirement = document.getElementById("requirement").value.trim();

    msg.innerHTML = "";

    if (!name || !phone || !location || !requirement) {
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
    phone: phone,
    location: location,
    requirement: requirement
                })
            });

    if (!response.ok) {
                throw new Error("Server error");
            }

    const result = await response.text();

    msg.innerHTML = `<span style="color:green;">✅ ${result}</span>`;
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


    // 📍 AUTO LOCATION FUNCTION
    function getLocation() {
    const locationInput = document.getElementById("location");

    if (navigator.geolocation) {
        locationInput.value = "Fetching location...";

    navigator.geolocation.getCurrentPosition(
    async function(position) {
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
    function() {
        locationInput.value = "Location access denied ❌";
            }
    );
    } else {
        locationInput.value = "Not supported ❌";
    }
}
</script>