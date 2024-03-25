const
    express = require('express'),
    userRouter = express.Router(),
    passport = require('passport'),
    Auth = require('../lib/auth.js'),
    { UserController } = require('../controller/userController.js');

userRouter
    .post('/register', UserController.register)
    .post('/admin/register', UserController.registerAdmin)
    .post('/login', UserController.login)
    .get('/verify/:id', UserController.verifyUser)

userRouter.use(passport.initialize(), Auth.authentication, Auth.authorize)

userRouter
    .get('/profile', UserController.getUser)
    .put('/profile', UserController.editUser)
    .delete('/', UserController.deleteUser)


module.exports = userRouter