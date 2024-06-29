const passport = require('./passport')
const {CustomError} = require('../errors/customError')

class Auth {
    static authentication = passport.authenticate('jwt', {
        session: false
    })

    static authorizeAdmin = (req, res, next) => {
        if(req.user && req.user.isAdmin) {
            next()
        } else {
            throw new CustomError('You have no permissio to access', 403)
        }
    }

    static authorizeUser = (req, res, next) => {
        if (req.user && !req.user.isAdmin) {
            next()
        } else {
            throw new CustomError('You have no permissio to access', 403)
        }
    }

}

module.exports = Auth