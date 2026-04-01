const express = require('express')
const db = require('../database')
const authenticateToken = require('../middleware/authenticateToken')

const router = express.Router()

// ========================
// GET ALL JOBS (with filters)
// ========================
router.get('/', authenticateToken, (req, res) => {
  try {
    const {search = '', employment_type = '', minimum_package = ''} = req.query

    let query = 'SELECT * FROM jobs WHERE 1=1'
    const params = []

    // Search filter
    if (search) {
      query += ' AND (title LIKE ? OR job_description LIKE ? OR location LIKE ?)'
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Employment type filter (comma-separated like "Full Time,Part Time")
    if (employment_type) {
      const types = employment_type.split(',').map(t => t.trim()).filter(Boolean)
      if (types.length > 0) {
        const placeholders = types.map(() => '?').join(', ')
        query += ` AND employment_type IN (${placeholders})`
        params.push(...types)
      }
    }

    // Salary range filter — uses the salary_value integer column (e.g. 1000000 = 10 LPA)
    if (minimum_package && minimum_package !== '') {
      const minSalary = parseInt(minimum_package, 10)
      if (!isNaN(minSalary) && minSalary > 0) {
        query += ' AND salary_value >= ?'
        params.push(minSalary)
      }
    }

    console.log('🔍 Query:', query, '| Params:', params)

    const jobs = db.prepare(query).all(...params)

    res.json({jobs})
  } catch (err) {
    console.error('Jobs fetch error:', err.message)
    res.status(500).json({error_msg: 'Failed to fetch jobs'})
  }
})

// ========================
// GET SINGLE JOB DETAILS
// ========================
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const {id} = req.params

    const jobDetails = db.prepare('SELECT * FROM jobs WHERE id = ?').get(id)

    if (!jobDetails) {
      return res.status(404).json({error_msg: 'Job not found'})
    }

    const similarJobs = db
      .prepare('SELECT * FROM similar_jobs WHERE job_id = ?')
      .all(id)

    res.json({
      job_details: jobDetails,
      similar_jobs: similarJobs,
    })
  } catch (err) {
    console.error('Job detail fetch error:', err.message)
    res.status(500).json({error_msg: 'Failed to fetch job details'})
  }
})

module.exports = router
