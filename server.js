// server.js
//
// Right now only contains login system
// Referenced from https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/server.js

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fs = require('fs');

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    username => users.find(user => user.username === username),
    id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false})) // https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// read json data
let rawdata = fs.readFileSync('users.json');
let users = JSON.parse(rawdata);

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.username })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('LoginVS.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)