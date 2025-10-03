const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db/queries')
const bcrypt = require('bcrypt')

const verifyCallBack = async (username, password, done) => {
    try {
        const user = await db.getUserByUsername(username) 
        const hash = await db.getHash(user.id)
        if (!user) {
            return done(null, false)
        } else if (await bcrypt.compare(password, hash)) {
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch(err) {
        console.log("Error at verifyCallback: ")
        throw new Error(err)
    }
}

passport.use(new LocalStrategy(verifyCallBack))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await db.getUser(userId)
        done(null, user)
    } catch(err) {
        console.log("Error at deserializeUser: ")
        throw new Error(err)
    }
})