// Importing required modules: mysql2 with promise support and dotenv for environment variables
const mysql = require('mysql2/promise')
require('dotenv').config()

// Creating a connection pool using environment variables for configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
})

// Function to initialize the database: establishes connection and creates tables if missing
async function initDB() {
  try {
    const conn = await pool.getConnection()

    // Create 'users' table with unique username and email, plus password and timestamp
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Creating 'tasks' table linked to 'users' table with foreign key, includes task details
    await conn.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(500),
        priority VARCHAR(20) DEFAULT 'medium',
        due VARCHAR(50),
        done TINYINT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // Releasing connection back to pool and confirm success
    conn.release()
    console.log('Connected to MySQL database')
  } catch (err) {
    // Handle and log connection or query errors
    console.log('Database connection failed:', err.message)
  }
}

// Running initialization immediately when file is loaded
initDB()

// Exporting the pool so other modules can query the database
module.exports = pool
