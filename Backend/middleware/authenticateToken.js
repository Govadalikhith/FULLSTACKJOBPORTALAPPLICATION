const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'myjobportalsecretkey2024'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({error_msg: 'Access token required'})
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({error_msg: 'Invalid or expired token'})
  }
}

module.exports = authenticateToken
