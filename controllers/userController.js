const db = require('../db/queries')
const { body, validationResult } = require('express-validator')
const passport = require('passport')

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

function registerGet(req, res, next) {
    res.render('register')
}

async function registerPost(req, res, next) {
    try {
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const username = req.body.username
        const password = req.body.password
        const isAdmin = req.body.isAdmin ? true : false

        await db.addUser(firstname, lastname, username, password, isAdmin)
        
        res.redirect('/login')
    } catch(err) {
        console.log("Error in registerPost")
        next(err)
    }
}

const validateRegisterMiddlewares = [
    body('firstname')
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty.')
        .matches(/^[A-Za-z\s]+$/) 
        .withMessage('First name must contain only letters and spaces.')
        .isLength({ min: 2, max: 12 })
        .withMessage('First name must be between 2 and 12 characters long.'),

    body('lastname')
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty.')
        .matches(/^[A-Za-z\s]+$/) 
        .withMessage('Last name must contain only letters and spaces.')
        .isLength({ min: 2, max: 12 })
        .withMessage('Last name must be between 2 and 12 characters long.'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username cannot be empty.')
        .isLength({ min: 8, max: 20 })
        .withMessage('Username must be between 8 and 20 characters long.'),

    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty.')
        .matches(/^\S*$/)
        .withMessage('Password cannot contain spaces')
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8 and 20 characters long.'),

    body('confirm-password')
        .custom((value, { req }) => {
            return value === req.body.password;
        })
        .withMessage('Password must match Confirm Password.')
]


function validateRegister(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        res.status(400).render('register', { errors: result.array() })
    } else {
        next()
    }
}

function loginGet(req, res, next) {
    res.render('login')
}

function loginPost(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login-error'
    })(req, res, next)
}

function loginErrorGet(req, res, next) {
    res.render('login_error')
}

function logoutGet(req, res, next) {
    req.logout((err) => {
        if (err) return next(err)
        res.redirect('/')
    })
}

function membershipGet(req, res, next) {
    res.render('membership')
}

async function membershipPost(req, res, next) {
    try {
        const secretCode = '12345678'
        if (req.body.secretCode === secretCode) {
            await db.setMembership(req.user.id, true)
            return res.redirect('/')
        } else {
            return res.render('membership', { error_msg: "Wrong secret code." })
        }
    } catch(err) {
        console.log("Error at membershipPost")
        next(err)
    }
}

function newMessageGet(req, res, next) {
    res.render('new_message')
}

async function newMessagePost(req, res, next) {
    try {
        await db.addMessage(req.user.id, req.body.title, req.body.message) 
        res.redirect('/')
    } catch(err) {
        console.log("Error in newMessagePost")
        next(err)
    }
}

async function deleteMessageGet(req, res, next) {
    try {
        await db.deleteMessage(req.params.messageId)
        res.redirect('/')
    } catch(err) {
        console.log("Error in deleteMessageGet")
        next(err)
    }
}

module.exports = {
    indexGet,
    registerGet,
    validateRegisterMiddlewares,
    validateRegister,
    registerPost,
    loginGet,
    loginPost,
    loginErrorGet,
    logoutGet,
    membershipGet,
    membershipPost,
    newMessageGet,
    newMessagePost,
    deleteMessageGet,
}
