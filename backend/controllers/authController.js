const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await admin.comparePassword(password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ success: true, token, admin: { name: admin.name, email: admin.email } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')
    res.json({ success: true, admin })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
