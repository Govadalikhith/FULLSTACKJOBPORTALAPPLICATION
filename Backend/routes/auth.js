const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../database')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'myjobportalsecretkey2024'

// ========================
// REGISTER (SIGNUP)
// ========================
router.post('/register', async (req, res) => {
  try {
    const {name, username, email, password} = req.body

    if (!name || !username || !email || !password) {
      return res.status(400).json({error_msg: 'All fields are required'})
    }

    // Check if user already exists
    const existingUser = db
      .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
      .get(username, email)

    if (existingUser) {
      return res.status(400).json({error_msg: 'Username or Email already exists'})
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert into database
    db.prepare(
      'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)',
    ).run(name, username, email, hashedPassword)

    res.status(201).json({message: 'User registered successfully! Please login.'})
  } catch (err) {
    console.error('Register error:', err.message)
    res.status(500).json({error_msg: 'Internal server error'})
  }
})

// ========================
// LOGIN
// ========================
router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body

    if (!username || !password) {
      return res.status(400).json({error_msg: 'Username and password are required'})
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username)

    if (!user) {
      return res.status(401).json({error_msg: 'Invalid credentials'})
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({error_msg: 'Invalid credentials'})
    }

    // Generate JWT token
    const jwt_token = jwt.sign(
      {id: user.id, username: user.username},
      JWT_SECRET,
      {expiresIn: '30d'},
    )

    res.json({jwt_token})
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({error_msg: 'Internal server error'})
  }
})

module.exports = router
