const router = require('express').Router()
const { createContact } = require('../controllers/adminController')

router.post('/', createContact)

module.exports = router
