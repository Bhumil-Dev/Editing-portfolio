const mongoose = require('mongoose')

const statItemSchema = {
  value:   { type: Number,  default: 0 },
  label:   { type: String,  default: '' },
  suffix:  { type: String,  default: '+' },
  visible: { type: Boolean, default: true },
}

const statsSchema = new mongoose.Schema({
  projects: { ...statItemSchema, value: { type: Number, default: 50  }, label: { type: String, default: 'Projects Completed' }, suffix: { type: String, default: '+' }  },
  clients:  { ...statItemSchema, value: { type: Number, default: 20  }, label: { type: String, default: 'Happy Clients'       }, suffix: { type: String, default: '+' }  },
  years:    { ...statItemSchema, value: { type: Number, default: 3   }, label: { type: String, default: 'Years Experience'    }, suffix: { type: String, default: '+' }  },
  views:    { ...statItemSchema, value: { type: Number, default: 1   }, label: { type: String, default: 'Million Views'       }, suffix: { type: String, default: 'M+' }, visible: { type: Boolean, default: true } },
}, { timestamps: true })

module.exports = mongoose.model('Stats', statsSchema)
