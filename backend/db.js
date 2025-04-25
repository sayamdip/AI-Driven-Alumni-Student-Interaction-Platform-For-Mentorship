const mysql = require("mysql2");
const dotenv = require("dotenv")
dotenv.config()

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PW,  // Use your MySQL password
  database: "alumni-connect"
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

module.exports = connection;
