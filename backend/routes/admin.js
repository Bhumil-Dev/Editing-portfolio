const router  = require('express').Router()
const ctrl    = require('../controllers/adminController')
const auth    = require('../middleware/auth')
const upload  = require('../middleware/upload')

// Profile
router.get('/profile',          auth, ctrl.getProfile)
router.put('/profile',          auth, ctrl.updateProfile)

// Uploads
router.post('/upload',          auth, upload.single('file'), ctrl.upload)
router.post('/upload/profile',  auth, upload.single('file'), ctrl.uploadProfile)
router.post('/upload/logo',     auth, upload.single('file'), ctrl.uploadLogo)

// Skills
router.get('/skills',           auth, ctrl.getSkills)
router.post('/skills',          auth, upload.single('logo'), ctrl.createSkill)
router.put('/skills/:id',       auth, upload.single('logo'), ctrl.updateSkill)
router.delete('/skills/:id',    auth, ctrl.deleteSkill)

// Services
router.get('/services',         auth, ctrl.getServices)
router.post('/services',        auth, ctrl.createService)
router.put('/services/:id',     auth, ctrl.updateService)
router.delete('/services/:id',  auth, ctrl.deleteService)

// Projects
router.get('/projects',         auth, ctrl.getProjects)
router.post('/projects',        auth, upload.single('thumbnail'), ctrl.createProject)
router.put('/projects/:id',     auth, upload.single('thumbnail'), ctrl.updateProject)
router.delete('/projects/:id',  auth, ctrl.deleteProject)

// Messages
router.get('/messages',         auth, ctrl.getMessages)
router.delete('/messages/:id',  auth, ctrl.deleteMessage)

// Stats
router.get('/stats',            auth, ctrl.getStats)

module.exports = router
