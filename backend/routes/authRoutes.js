const express = require("express");
const bcrypt = require("bcrypt");
const connection = require("../db");
const router = express.Router();

// Sample login route for both alumni and students
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // First, try finding the user in alumni table
    const findAlumniSQL = `SELECT * FROM alumni WHERE email = ?`;
    connection.query(findAlumniSQL, [email], async (err, results) => {
        if (err) {
            console.error("Login query failed:", err);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                return res.status(200).json({ 
                    message: "Alumni login successful", 
                    userType: "alumni",
                    redirect: "/pages/index.html"
                });
                
            } else {
                return res.status(401).json({ message: "Invalid password" });
            }
        }
        
        // If not found in alumni, check students
        const findStudentSQL = `SELECT * FROM students WHERE email = ?`;
        connection.query(findStudentSQL, [email], async (err2, studentResults) => {
            if (err2) {
                console.error("Student login query failed:", err2);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (studentResults.length > 0) {
                const student = studentResults[0];
                const match = await bcrypt.compare(password, student.password);
                if (match) {
                    return res.status(200).json({ 
                        message: "Student login successful", 
                        userType: "student",
                        redirect: "/pages/index.html"
                     });
                } else {
                    return res.status(401).json({ message: "Invalid password" });
                }
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        });
    });
});

module.exports = router;
