const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Video Editing', 'Motion Graphics', 'Web Development'], required: true },
  thumbnail: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  tools: [{ type: String }],
  result: { type: String, default: '' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Project', projectSchema)
