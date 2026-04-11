const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors({
    origin: 'https://my-manager-alpha.vercel.app',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/tasks', require('./routes/tasks'))

app.get('/', (req, res) => {
    res.json({ message: 'Task Manager API is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})