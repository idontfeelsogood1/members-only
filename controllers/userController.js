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

async function registerGet(req, res, next) {
    res.render('register')
}


module.exports = {
    indexGet,
    registerGet,
}
