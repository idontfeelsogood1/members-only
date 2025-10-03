const express = require('express')
const session = require('express-session');
const passport = require('passport');
const pgPool = require('./db/pool')
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))

// Session storage 
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: pgPool,
    tableName: 'session'
  }),
  saveUninitialized: false,
  secret: process.env.SECRET,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// Passport configs
require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Routes
const indexRouter = require('./routes/indexRouter')
app.use('/', indexRouter)

// App running
const PORT = 3000
app.listen(PORT, (err) => {
    if (err) {
        console.log("Error starting app.")
        throw new Error(err)
    } else {
        console.log(`App listening on PORT: ${PORT}`)
    }
})