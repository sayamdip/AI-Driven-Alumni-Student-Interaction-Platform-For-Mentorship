require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT ||5000;

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "alumni_db",
});

db.connect((err) => {
    if (err) console.error("Database connection failed:", err);
    else console.log("✅ Connected to MySQL database.");
});

// Middleware Setup
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: true,
    })
);

// Root Route (Redirect to Admin Login Page)
app.get("/", (req, res) => {
    res.redirect("/admin");  // Redirect to admin login page
});

// Admin Login Page
app.get("/admin", (req, res) => {
    res.render("admin/admin-login", { message: "" });
});

// Admin Login POST
app.post("/admin", (req, res) => {
    const { email, password } = req.body;

    // For simplicity, check with a hardcoded admin credentials
    if (email === "admin@example.com" && password === "admin@108") {
        req.session.admin = true;
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("admin/admin-login", { message: "❌ Incorrect email or password." });
    }
});

// Admin Logout Route
app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/admin"));
});

// Admin Dashboard Page
app.get("/admin/dashboard", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    res.render("admin/admin-dashboard");
});

// Add Alumni Page
app.get("/admin/alumni/add", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    res.render("admin/add-alumni", { message: "" });
});

// Handle Add Alumni POST Route
app.post("/admin/alumni/add", async (req, res) => {
    const { alumni_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO alumni (alumni_name, email, password) VALUES (?, ?, ?)",
        [alumni_name, email, hashedPassword],
        (err) => {
            if (err) return res.render("admin/add-alumni", { message: "❌ Error adding alumni." });
            res.redirect("/admin/alumni/view");
        }
    );
});

// View Alumni Page
app.get("/admin/alumni/view", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    db.query("SELECT * FROM alumni", (err, results) => {
        if (err) return res.send("Error loading alumni.");
        res.render("admin/view-alumni", { alumni: results }); // Pass `alumni`, not `therapies`
    });
});


// Manage Alumni Page
// Manage Alumni Page
app.get("/admin/alumni/manage", (req, res) => {
    if (!req.session.admin) return res.redirect("/admin");

    db.query("SELECT * FROM alumni", (err, alumni) => {
        if (err) return res.send("Error loading alumni.");
        res.render("admin/manage-alumni", { alumni });
    });
});

// API to Delete Alumni
app.post("/admin/alumni/delete", (req, res) => {
    if (!req.session.admin) return res.status(403).send("Unauthorized");

    const { alumni_id } = req.body;

    db.query("DELETE FROM alumni WHERE id = ?", [alumni_id], (err, result) => {
        if (err) {
            console.error("Error deleting alumni: ", err);
            return res.status(500).json({ success: false, message: "Failed to delete alumni" });
        }
        res.json({ success: true, message: "Alumni deleted successfully" });
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
