const passport = require('./passport')

class Auth {
    static authentication = passport.authenticate('jwt', {
        session: false
    })

    static authorizeAdmin = (req, res, next) => {
        if(req.user && req.user.isAdmin) {
            next()
        } else {
            res.status(401).json("You have no permission to acces")
        }
    }

    static authorizeUser = (req, res, next) => {
        if (!req.user) {
            return res.status(401).json("please login first")
        }
        if (req.user && !req.user.isAdmin) {
            next()
        } else {
            res.status(401).json("You have no permission to acces this endpoint")
        }
    }

    static authorize = (req, res, next) => {
        if(!req.user) {
            return res.status(401).json("please login first")
        }

        next()
    }
}

module.exports = Auth