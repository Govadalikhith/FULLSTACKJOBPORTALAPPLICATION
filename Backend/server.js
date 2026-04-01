require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const jobRoutes = require('./routes/jobs')

// Initialize database (this runs the seeding)
require('./database')

const app = express()
const PORT = process.env.PORT || 5000

// ========================
// MIDDLEWARE
// ========================
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// ========================
// ROUTES
// ========================
app.use('/auth', authRoutes)
app.use('/api/jobs', jobRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({message: '🚀 Job Portal API is running!', status: 'OK'})
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({error_msg: 'Route not found'})
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
  console.log(`📦 Database connected and ready!`)
})
