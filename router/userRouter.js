
const
    express = require('express'),
    userRouter = express.Router(),
    passport = require('passport'),
    Auth = require('../lib/auth.js'),
    { UserController } = require('../controller/userController.js'),
    { AddressController } = require('../controller/addressController.js');

userRouter
    .post('/register', UserController.register)
    .post('/admin/register', UserController.registerAdmin)
    .post('/login', UserController.login)
    .get('/verify/:id', UserController.verifyUser)

userRouter.use(passport.initialize(), Auth.authentication)

userRouter
    .get('/profile', Auth.authorize , UserController.getUser)
    .put('/profile', Auth.authorize , UserController.editUser)
    .delete('/', Auth.authorize , UserController.deleteUser)

userRouter
    .get('/addresses', Auth.authorizeUser, AddressController.getAllAddresses)
    .get('/addresses/:id', Auth.authorizeUser, AddressController.getUserAddressById)
    .post('/addresses', Auth.authorizeUser, AddressController.createNewAddress)
    .put('/addresses/:id', Auth.authorizeUser, AddressController.updateAddress)
    .patch('/addresses/:id', Auth.authorizeUser, AddressController.updateMainAddress)
    .delete('/addresses/:id', Auth.authorizeUser, AddressController.deleteAddress)

module.exports = userRouter