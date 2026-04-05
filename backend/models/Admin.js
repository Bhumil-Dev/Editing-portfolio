const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  name:         { type: String, default: 'Bhumil Prajapati' },
  title:        { type: String, default: 'Video Editor & MERN Stack Developer' },
  tagline:      { type: String, default: 'I Turn Ideas Into Visual Experiences' },
  about:        { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  logo:         { type: String, default: '' },
  phone:        { type: String, default: '8511872920' },
  contactEmail: { type: String, default: 'bhumilprajapati4@gmail.com' },
  whatsapp:     { type: String, default: '918511872920' },
  location:     { type: String, default: 'India (Available Worldwide)' },
  social: {
    youtube:   { type: String, default: '' },
    instagram: { type: String, default: 'https://www.instagram.com/bhumil_0003/' },
    linkedin:  { type: String, default: 'https://www.linkedin.com/in/bhumil-prajapati-07429a374/' },
    github:    { type: String, default: 'https://github.com/Bhumil-Dev' },
    twitter:   { type: String, default: '' },
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
