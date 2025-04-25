const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../db"); // Import database connection
const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
    const { fullName, email, password, userType, graduationYear, department } = req.body;

    try {
        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        if(userType === "alumni") {
            const sql = `INSERT INTO alumni (username, email, password, grad_year, dept) 
                     VALUES (?, ?, ?, ?, ?)`;

            connection.query(
                sql,
                [fullName, email, hashedPassword, graduationYear || null, department],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Registration failed!" });
                    }
                    return res.status(201).json({ 
                        message: "Registration successful!", 
                        redirect: "/pages/login.html" 
                    });
                }
            );
        }
        else if(userType === "student") {
            const sql = `INSERT INTO students (username, email, password, dept) 
                     VALUES (?, ?, ?, ?)`;

            connection.query(
                sql,
                [fullName, email, hashedPassword || null, department],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting user:", err);
                        return res.status(500).json({ message: "Registration failed!" });
                    }
                    return res.status(201).json({ 
                        message: "Registration successful!", 
                        redirect: "/pages/login.html" 
                    });
                }
            );
        }

        
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
