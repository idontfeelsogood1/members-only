const db = require('../db/queries')

async function indexGet(req, res, next) {
    try {
        const user = req.user
        const users = await db.getUsersAndMessages()
        const isAuth = req.isAuthenticated()

        res.render('index', { 
            user: user,
            users: users, 
            title: 'Members Club',
            isAuth: isAuth
        })
    } catch(err) {
        console.log("Error in indexGet")
        next(err)
    }
}

module.exports = {
    indexGet,
}
// user = req.isAuthenticated()
// If user is authenticated 
    // Show home button
    // Show logout button 
    // Show post message button

    // If user is membership
        // Show message authors 
    // If user is admin
        // Show message authors
        // Show delete button

// Else
    // Show home button
    // Show signup button
    // Show login button

    // Show Anonymous as authors