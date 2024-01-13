const
    express = require('express'),
    userRouter = express.Router(),
    { UserController } = require('../controller/userController.js');

userRouter.post('/register', UserController.register)
userRouter.post('/login', UserController.login)
userRouter.get('/users', UserController.getUser)

module.exports = userRouter