// Importing required modules: Express for routing, MySQL pool for database queries,
// and authentication middleware to protect routes
const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const authMiddleware = require('../middleware/auth')

// GET route: fetch all tasks belonging to the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [tasks] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id])
        res.json(tasks)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// POST route: create a new task for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, priority, due } = req.body
    if (!title) {
        return res.status(400).json({ message: 'Title is required' })
    }
    try {
        await pool.query(
            'INSERT INTO tasks (user_id, title, description, priority, due) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, description || '', priority || 'medium', due || '']
        )
        res.status(201).json({ message: 'Task created' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// PUT route: update an existing task belonging to the authenticated user
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, priority, due, done } = req.body
    try {
        await pool.query(
            'UPDATE tasks SET title=?, description=?, priority=?, due=?, done=? WHERE id=? AND user_id=?',
            [title, description || '', priority || 'medium', due || '', done ? 1 : 0, req.params.id, req.user.id]
        )
        res.json({ message: 'Task updated' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// DELETE route: remove a task belonging to the authenticated user
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM tasks WHERE id=? AND user_id=?',
            [req.params.id, req.user.id]
        )
        res.json({ message: 'Task deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Exporting router so it can be mounted in the main server file
module.exports = router
