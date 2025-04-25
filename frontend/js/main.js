document.addEventListener("DOMContentLoaded", function () {
    console.log("Frontend Loaded!");

    // Example: Fetch and display users (when backend is connected)
    fetch("http://localhost:5000/api/users")
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Users:", data);
        })
        .catch(error => console.error("Error fetching users:", error));
});
