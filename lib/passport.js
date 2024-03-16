const passport = require('passport')
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')
const {User} = require('../models')
require('dotenv').config()

const opt = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.SECRET_KEY
}

passport.use(new JwtStrategy (opt, (payload, done) => {
    User.findByPk(payload.id)
        .then((user) => {
            done(null, user)
        }).catch((err) => {
            done(err, null)
        });
}))

module.exports = passport