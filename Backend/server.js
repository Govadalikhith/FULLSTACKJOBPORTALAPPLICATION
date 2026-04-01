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
const allowedOrigins = [
  'https://lively-lokum-fce37f.netlify.app',
  'https://lively-lokum-fce37f.netlify.app/',
  'http://localhost:3000'
]

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, '')) // No slash
  allowedOrigins.push(process.env.FRONTEND_URL.endsWith('/') ? process.env.FRONTEND_URL : `${process.env.FRONTEND_URL}/`) // With slash
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running and listening on port ${PORT}`)
  console.log(`📦 Database initialized with SQLite`)
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`)
})
