const router = require('express').Router()
const ctrl   = require('../controllers/adminController')

router.get('/profile',  ctrl.publicProfile)
router.get('/skills',   ctrl.publicSkills)
router.get('/services', ctrl.publicServices)
router.get('/projects', ctrl.publicProjects)

module.exports = router
