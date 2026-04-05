const Admin   = require('../models/Admin')
const Skill   = require('../models/Skill')
const Service = require('../models/Service')
const Project = require('../models/Project')
const Contact = require('../models/Contact')

// ── Profile ──────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')
    res.json({ success: true, data: admin })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.updateProfile = async (req, res) => {
  try {
    const fields = ['name','title','tagline','about','phone','contactEmail','whatsapp','location','social']
    const update = {}
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f] })
    const admin = await Admin.findByIdAndUpdate(req.admin.id, update, { new: true }).select('-password')
    res.json({ success: true, data: admin })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Upload ────────────────────────────────────────────────
exports.upload = (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
  res.json({ success: true, url: `/uploads/${req.file.filename}` })
}

exports.uploadProfile = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' })
  const url = `/uploads/${req.file.filename}`
  await Admin.findByIdAndUpdate(req.admin.id, { profilePhoto: url })
  res.json({ success: true, url })
}

exports.uploadLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file' })
  const url = `/uploads/${req.file.filename}`
  await Admin.findByIdAndUpdate(req.admin.id, { logo: url })
  res.json({ success: true, url })
}

// ── Skills ────────────────────────────────────────────────
exports.getSkills    = async (req, res) => {
  try { res.json({ success: true, data: await Skill.find().sort('order') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.createSkill  = async (req, res) => {
  try {
    const { name, color, category, order } = req.body
    if (!name) return res.status(400).json({ success: false, message: 'Name required' })
    const logo = req.file ? `/uploads/${req.file.filename}` : req.body.logo || ''
    const skill = await Skill.create({ name, logo, color, category, order: order || 0 })
    res.status(201).json({ success: true, data: skill })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.updateSkill  = async (req, res) => {
  try {
    const update = { ...req.body }
    if (req.file) update.logo = `/uploads/${req.file.filename}`
    res.json({ success: true, data: await Skill.findByIdAndUpdate(req.params.id, update, { new: true }) })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteSkill  = async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Skill deleted' }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Services ──────────────────────────────────────────────
exports.getServices   = async (req, res) => {
  try { res.json({ success: true, data: await Service.find().sort('order') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.createService = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body
    if (!title || !description) return res.status(400).json({ success: false, message: 'Title and description required' })
    res.status(201).json({ success: true, data: await Service.create({ title, description, icon, order: order || 0 }) })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.updateService = async (req, res) => {
  try { res.json({ success: true, data: await Service.findByIdAndUpdate(req.params.id, req.body, { new: true }) }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteService = async (req, res) => {
  try { await Service.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Service deleted' }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Projects ──────────────────────────────────────────────
exports.getProjects   = async (req, res) => {
  try { res.json({ success: true, data: await Project.find().sort('-createdAt') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.createProject = async (req, res) => {
  try {
    const { title, description, category, videoUrl, tools, result, featured } = req.body
    if (!title || !description || !category)
      return res.status(400).json({ success: false, message: 'Title, description, category required' })
    const thumbnail = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail || ''
    const project = await Project.create({
      title, description, category, thumbnail, videoUrl,
      tools: tools ? (Array.isArray(tools) ? tools : tools.split(',').map(t => t.trim())) : [],
      result, featured: featured === 'true',
    })
    res.status(201).json({ success: true, data: project })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.updateProject = async (req, res) => {
  try {
    const update = { ...req.body }
    if (req.file) update.thumbnail = `/uploads/${req.file.filename}`
    if (update.tools && !Array.isArray(update.tools))
      update.tools = update.tools.split(',').map(t => t.trim())
    res.json({ success: true, data: await Project.findByIdAndUpdate(req.params.id, update, { new: true }) })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteProject = async (req, res) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Project deleted' }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Messages ──────────────────────────────────────────────
exports.getMessages   = async (req, res) => {
  try { res.json({ success: true, data: await Contact.find().sort('-createdAt') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.deleteMessage = async (req, res) => {
  try { await Contact.findByIdAndDelete(req.params.id); res.json({ success: true, message: 'Message deleted' }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Stats ─────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const [projects, skills, services, messages] = await Promise.all([
      Project.countDocuments(), Skill.countDocuments(),
      Service.countDocuments(), Contact.countDocuments(),
    ])
    const recent = await Contact.find().sort('-createdAt').limit(5)
    res.json({ success: true, data: { projects, skills, services, messages, recent } })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Stats (public) ───────────────────────────────────────
exports.publicStats = async (req, res) => {
  try {
    const Stats = require('../models/Stats')
    let stats = await Stats.findOne()
    if (!stats) stats = await Stats.create({})
    res.json({ success: true, data: stats })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Stats (admin update) ──────────────────────────────────
exports.updateStats = async (req, res) => {
  try {
    const Stats = require('../models/Stats')
    let stats = await Stats.findOne()
    if (!stats) stats = await Stats.create({})

    // Accept full nested objects per stat key
    const keys = ['projects', 'clients', 'years', 'views']
    keys.forEach(k => {
      if (req.body[k] !== undefined) {
        const incoming = req.body[k]
        if (typeof incoming === 'object') {
          if (incoming.value   !== undefined) stats[k].value   = incoming.value
          if (incoming.label   !== undefined) stats[k].label   = incoming.label
          if (incoming.suffix  !== undefined) stats[k].suffix  = incoming.suffix
          if (incoming.visible !== undefined) stats[k].visible = incoming.visible
        } else {
          // backward compat: plain number
          stats[k].value = incoming
        }
      }
    })

    stats.markModified('projects')
    stats.markModified('clients')
    stats.markModified('years')
    stats.markModified('views')
    await stats.save()
    res.json({ success: true, data: stats })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ── Public ────────────────────────────────────────────────
exports.publicProfile  = async (req, res) => {
  try { res.json({ success: true, data: await Admin.findOne().select('-password -__v') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.publicSkills   = async (req, res) => {
  try { res.json({ success: true, data: await Skill.find().sort('order') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.publicServices = async (req, res) => {
  try { res.json({ success: true, data: await Service.find().sort('order') }) }
  catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.publicProjects = async (req, res) => {
  try {
    const { category } = req.query
    const filter = category && category !== 'All' ? { category } : {}
    res.json({ success: true, data: await Project.find(filter).sort('-createdAt') })
  } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

exports.createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' })
    const contact = await Contact.create({ name, email, message })
    res.status(201).json({ success: true, message: "Message sent successfully!", data: contact })
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ success: false, message: messages.join(', ') })
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' })
  }
}
