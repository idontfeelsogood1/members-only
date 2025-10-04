const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Show all messages
router.get('/', userController.indexGet)

// Register
router.get('/register', userController.registerGet) 
router.post('/register', 
    userController.validateRegisterMiddlewares,
    userController.validateRegister,
    userController.registerPost
)

// Login
router.get('/login', userController.loginGet)
router.post('/login', userController.loginPost)
router.get('/login-error', userController.loginErrorGet)

// Logout
router.get('/logout', userController.logoutGet)

// Membership
router.get('/membership', userController.membershipGet)
router.post('/membership', userController.membershipPost)

// Post message
router.get('/new-message', userController.newMessageGet)
router.post('/new-message', userController.newMessagePost)

// Delete message
router.get('/delete-message/:messageId', userController.deleteMessageGet)

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack) 

    const statusCode = err.status || 500
    const message = err.message || 'An unexpected server error occurred.'

    res.status(statusCode).render('error', { 
        status: statusCode, 
        message: message 
    })
})

module.exports = router