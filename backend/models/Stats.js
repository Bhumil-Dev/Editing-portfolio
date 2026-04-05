const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  projects:  { type: Number, default: 50 },
  clients:   { type: Number, default: 20 },
  years:     { type: Number, default: 3 },
  views:     { type: Number, default: 1 },
}, { timestamps: true })

module.exports = mongoose.model('Stats', statsSchema)
