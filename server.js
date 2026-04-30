// Importing required modules: Express for server, CORS for cross-origin requests,
// and dotenv for environment variables
const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Initialize Express application
const app = express()

// Configuring CORS to allow requests only from my frontend (Vercel app),
// with credentials enabled 
app.use(cors({
    origin: 'https://my-manager-alpha.vercel.app',
    credentials: true
}))

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mount authentication and task routes under /api paths
app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

// Root endpoint: simple health check to confirm API is running
app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API is running' })
})

// Starting server on configured port (from .env or default 5000)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
