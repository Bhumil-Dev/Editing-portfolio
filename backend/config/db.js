// Force Google DNS to resolve MongoDB Atlas SRV records
const dns = require('dns')
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

const mongoose = require('mongoose')

async function connectDB(retries = 5, delay = 4000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 30000,
      })
      console.log('✅ MongoDB Atlas connected!')
      return true
    } catch (err) {
      console.log(`⏳ DB attempt ${i}/${retries}: ${err.message}`)
      if (i < retries) await new Promise(r => setTimeout(r, delay))
    }
  }
  console.error('❌ MongoDB connection failed after all retries.')
  return false
}

module.exports = connectDB
