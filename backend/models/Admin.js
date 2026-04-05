const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Bhumil Prajapati' },
  title: { type: String, default: 'Video Editor & MERN Stack Developer' },
  tagline: { type: String, default: 'I Turn Ideas Into Visual Experiences' },
  about: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  logo: { type: String, default: '' },
  phone: { type: String, default: '' },
  contactEmail: { type: String, default: 'bhumilprajapati4@gmail.com' },
  whatsapp: { type: String, default: '' },
  location: { type: String, default: 'India' },
  social: {
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
}, { timestamps: true })

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

adminSchema.methods.comparePassword = async function (plain) {
  return bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)
