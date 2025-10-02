const express = require('express')
const router = express.Router()

// Show all messages
router.get('/', userController.indexGet)

// Register
// router.get('/register', userController.registerGet) 
// router.post('/register', userController.registerPost)

// // Login
// router.get('/login', userController.loginGet)
// router.post('/login', userController.loginPost)

// // Membership/admin
// router.get('/membership', userController.membershipGet)
// router.post('/membership', userController.membershipPost)
// router.get('/admin', userController.adminGet)
// router.post('/admin', userController.adminPost)

// // Post message
// router.get('/new-message', userController.newMessageGet)
// router.post('/new-message', userController.newMessagePost)

// // Delete message
// router.get('/delete-message', userController.deleteMessageGet)

// // Logout
// router.get('/logout', userController.logoutGet)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack) 

    const statusCode = err.status || 500
    const message = err.message || 'An unexpected server error occurred.'

    res.status(statusCode).render('error', { 
        status: statusCode, 
        message: message 
    })
})