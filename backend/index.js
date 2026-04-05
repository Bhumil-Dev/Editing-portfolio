require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const path      = require('path')
const connectDB = require('./config/db')

const app  = express()
const PORT = process.env.PORT || 5000

// ── CORS — allow localhost + any Vercel deployment ────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Vercel production & preview URLs
  /^https:\/\/.*\.vercel\.app$/,
  // Add your custom domain here if you have one:
  // 'https://bhumilprajapati.com',
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true)
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    )
    if (allowed) return callback(null, true)
    callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// ── Middleware ────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Health check (Render pings this) ─────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Bhumil Portfolio API running',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'development',
  })
})

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/admin',   require('./routes/admin'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api',         require('./routes/public'))

// ── 404 ───────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message)
  res.status(500).json({ success: false, message: err.message || 'Internal server error' })
})

// ── Seed admin on first run ───────────────────────────────
async function seedAdmin() {
  try {
    const Admin = require('./models/Admin')
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
    if (!exists) {
      await Admin.create({
        email:        process.env.ADMIN_EMAIL,
        password:     process.env.ADMIN_PASSWORD || '30048207',
        name:         'Bhumil Prajapati',
        title:        'Video Editor & MERN Stack Developer',
        tagline:      'I Turn Ideas Into Visual Experiences',
        phone:        '8511872920',
        contactEmail: 'bhumilprajapati4@gmail.com',
        whatsapp:     '918511872920',
        location:     'India (Available Worldwide)',
        social: {
          instagram: 'https://www.instagram.com/bhumil_0003/',
          linkedin:  'https://www.linkedin.com/in/bhumil-prajapati-07429a374/',
          github:    'https://github.com/Bhumil-Dev',
          youtube:   '',
          twitter:   '',
        },
      })
      console.log('✅ Admin seeded →', process.env.ADMIN_EMAIL)
    } else {
      // Update contact details on existing admin if still placeholder
      if (!exists.whatsapp || exists.whatsapp === '919876543210') {
        await Admin.findByIdAndUpdate(exists._id, {
          phone:        '8511872920',
          contactEmail: 'bhumilprajapati4@gmail.com',
          whatsapp:     '918511872920',
          location:     'India (Available Worldwide)',
          'social.instagram': 'https://www.instagram.com/bhumil_0003/',
          'social.linkedin':  'https://www.linkedin.com/in/bhumil-prajapati-07429a374/',
          'social.github':    'https://github.com/Bhumil-Dev',
        })
        console.log('✅ Admin contact details updated')
      } else {
        console.log('✅ Admin exists →', process.env.ADMIN_EMAIL)
      }
    }
  } catch (err) {
    console.error('⚠ Seed error:', err.message)
  }
}

// ── Start ─────────────────────────────────────────────────
async function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server → http://0.0.0.0:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
  })
  const connected = await connectDB()
  if (connected) await seedAdmin()
}

start()
