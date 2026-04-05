require('dotenv').config()
const express  = require('express')
const cors     = require('cors')
const path     = require('path')
const connectDB = require('./config/db')

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/admin',   require('./routes/admin'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api',         require('./routes/public'))

app.get('/', (req, res) => res.json({ success: true, message: '🚀 Bhumil Portfolio API running' }))

// ── 404 & Error handlers ──────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: err.message || 'Internal server error' })
})

// ── Seed admin on first run ───────────────────────────────
async function seedAdmin() {
  try {
    const Admin = require('./models/Admin')
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
    if (!exists) {
      await Admin.create({
        email:   process.env.ADMIN_EMAIL,
        password: '30048207',
        name:    'Bhumil Prajapati',
        title:   'Video Editor & MERN Stack Developer',
        tagline: 'I Turn Ideas Into Visual Experiences',
      })
      console.log('✅ Admin seeded →', process.env.ADMIN_EMAIL)
    } else {
      console.log('✅ Admin exists →', process.env.ADMIN_EMAIL)
    }
  } catch (err) {
    console.error('⚠ Seed error:', err.message)
  }
}

// ── Start ─────────────────────────────────────────────────
async function start() {
  app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`))
  const connected = await connectDB()
  if (connected) await seedAdmin()
}

start()
