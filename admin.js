if (localStorage.getItem("admin") !== "true") {
    window.location.replace("admin-login.html");
}
const BASE_URL = "https://website-backend-ye9m.onrender.com";

let allEnquiries = [];
let currentStatusFilter = "ALL";

/* 🔐 ADMIN LOGIN GUARD */
if (localStorage.getItem("admin") !== "true") {
    window.location.replace("admin-login.html");
}

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");

    // Fetch all enquiries from backend
    fetch(`${BASE_URL}/api/enquiry/all`)
        .then(res => res.json())
        .then(data => {
            allEnquiries = data;
            applyFilters();
        })
        .catch(err => {
            console.error("Failed to load enquiries", err);
            alert("Failed to load data");
        });

    // 🔍 SEARCH EVENT
    searchInput.addEventListener("input", applyFilters);
});

// 🔁 APPLY STATUS + SEARCH FILTER
function applyFilters() {

    const keyword = document.getElementById("searchInput").value.toLowerCase();
    let filtered = allEnquiries;

    if (currentStatusFilter !== "ALL") {
        filtered = filtered.filter(e => e.status === currentStatusFilter);
    }

    if (keyword) {
        filtered = filtered.filter(e =>
            e.name?.toLowerCase().includes(keyword) ||
            e.email?.toLowerCase().includes(keyword) ||
            e.message?.toLowerCase().includes(keyword)
        );
    }

    renderTable(filtered);
    updateCounters(filtered);
}

// 🧱 RENDER TABLE
function renderTable(data) {

    const tableBody = document.getElementById("enquiryTableBody");
    tableBody.innerHTML = "";

    data.forEach((e, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.message ?? ""}</td>
            <td>
                <select class="form-select form-select-sm" onchange="updateStatus(${e.id}, this.value)">
                    <option value="NEW" ${e.status === "NEW" ? "selected" : ""}>NEW</option>
                    <option value="CONTACTED" ${e.status === "CONTACTED" ? "selected" : ""}>CONTACTED</option>
                    <option value="ENROLLED" ${e.status === "ENROLLED" ? "selected" : ""}>ENROLLED</option>
                </select>
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteEnquiry(${e.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// 🔘 STATUS FILTER BUTTONS
function filterStatus(status) {
    currentStatusFilter = status;
    applyFilters();
}

// 🔁 UPDATE STATUS
function updateStatus(id, status) {
    fetch(`${BASE_URL}/api/enquiry/status/${id}?status=${status}`, { method: "PUT" })
        .then(() => {
            const e = allEnquiries.find(x => x.id === id);
            if (e) e.status = status;
            applyFilters();
        })
        .catch(err => console.error("Failed to update status", err));
}

// ❌ DELETE ENQUIRY
function deleteEnquiry(id) {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    fetch(`${BASE_URL}/api/enquiry/${id}`, { method: "DELETE" })
        .then(() => {
            allEnquiries = allEnquiries.filter(e => e.id !== id);
            applyFilters();
        })
        .catch(err => console.error("Failed to delete enquiry", err));
}

// 📊 UPDATE COUNTERS
function updateCounters(data) {

    document.getElementById("totalCount").innerText = data.length;

    document.getElementById("newCount").innerText =
        data.filter(e => e.status === "NEW").length;

    document.getElementById("contactedCount").innerText =
        data.filter(e => e.status === "CONTACTED").length;

    document.getElementById("enrolledCount").innerText =
        data.filter(e => e.status === "ENROLLED").length;
}

// 🔓 LOGOUT FUNCTION (from HTML button)
function logout() {
    localStorage.removeItem("admin");
    window.location.replace("admin-login.html");
}