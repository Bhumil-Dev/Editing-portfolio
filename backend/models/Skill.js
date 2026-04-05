const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logo: { type: String, default: '' },
  color: { type: String, default: '#00F5FF' },
  category: { type: String, enum: ['web', 'video', 'design', 'other'], default: 'web' },
  order: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Skill', skillSchema)
