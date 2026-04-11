const express = require('express')
const router = express.Router()
const { sql, poolPromise } = require('../config/db')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, async (req, res) => {
    try {
        const pool = await poolPromise
        const result = await pool.request()
            .input('user_id', sql.Int, req.user.id)
            .query('SELECT * FROM tasks WHERE user_id = @user_id')
        res.json(result.recordset)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

router.post('/', authMiddleware, async (req, res) => {
    const { title, description, priority, due } = req.body

    if (!title) {
        return res.status(400).json({ message: 'Title is required' })
    }

    try {
        const pool = await poolPromise
        await pool.request()
            .input('user_id', sql.Int, req.user.id)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description || '')
            .input('priority', sql.NVarChar, priority || 'medium')
            .input('due', sql.NVarChar, due || '')
            .query('INSERT INTO tasks (user_id, title, description, priority, due) VALUES (@user_id, @title, @description, @priority, @due)')
        res.status(201).json({ message: 'Task created' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, priority, due, done } = req.body

    try {
        const pool = await poolPromise
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('user_id', sql.Int, req.user.id)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description || '')
            .input('priority', sql.NVarChar, priority || 'medium')
            .input('due', sql.NVarChar, due || '')
            .input('done', sql.Bit, done ? 1 : 0)
            .query('UPDATE tasks SET title=@title, description=@description, priority=@priority, due=@due, done=@done WHERE id=@id AND user_id=@user_id')
        res.json({ message: 'Task updated' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const pool = await poolPromise
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('user_id', sql.Int, req.user.id)
            .query('DELETE FROM tasks WHERE id=@id AND user_id=@user_id')
        res.json({ message: 'Task deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

module.exports = router