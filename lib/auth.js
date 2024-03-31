const passport = require('./passport')

class Auth {
    static authentication = passport.authenticate('jwt', {
        session: false
    })

    static authorizeAdmin = (req, res, next) => {
        if(req.user && req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You have no permission to acces")
        }
    }

    static authorizeUser = (req, res, next) => {
        if (req.user && !req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You have no permission to acces")
        }
    }

}

module.exports = Auth