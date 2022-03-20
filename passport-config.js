// referenced from https://github.com/WebDevSimplified/Nodejs-Passport-Login/blob/master/passport-config.js

const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUsername, getUserId) {
    const authenticateUser = async (username, password, done) => {
        const user = getUsername(username)
        
        if (user == null) {
            return done(null, false, {message: 'Username not recognized'})
        }

        try {
            if (password == user.password) {
                return done(null, user)
            } 
            else {
                return done(null, false, {message: 'Password incorrect'})
            }
        } 
        
        catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserId(id))
    })
}

module.exports = initialize