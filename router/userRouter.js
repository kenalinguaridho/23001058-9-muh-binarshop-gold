const
    express = require('express'),
    userRouter = express.Router(),
    passport = require('passport'),
    Auth = require('../lib/auth.js'),
    upload = require('../lib/multer.js'),
    { UserController } = require('../controller/userController.js');

userRouter
    .post('/register', upload.single('avatar'), UserController.registerUser)
    .post('/admin/register', upload.single('avatar'), UserController.registerAdmin)
    .post('/login', UserController.login)
    .get('/verify/:id', UserController.verifyUser)

userRouter.use(passport.initialize(), Auth.authentication)

userRouter
    .get('/profile', UserController.getUser)
    .put('/profile', UserController.editUser)
    .delete('/', UserController.deleteUser)
    .post('/avatar', upload.single('avatar'), UserController.uploadAvatar)
    .delete('/avatar', UserController.deleteAvatar)

module.exports = userRouter