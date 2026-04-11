const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
require('dotenv').config()

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        )

        res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const user = users[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({ token, username: user.username })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

module.exports = router