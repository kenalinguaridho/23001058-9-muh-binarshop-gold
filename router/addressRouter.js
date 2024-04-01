const
    express = require('express'),
    addressRouter = express.Router(),
    passport = require('passport'),
    Auth = require('../lib/auth.js'),
    { AddressController } = require('../controller/addressController.js');

addressRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeUser)

addressRouter
    .get('/addresses', AddressController.getAllAddresses)
    .get('/addresses/:id', AddressController.getUserAddressById)
    .post('/addresses', AddressController.createNewAddress)
    .put('/addresses/:id', AddressController.updateAddress)
    .patch('/addresses/:id', AddressController.updateMainAddress)
    .delete('/addresses/:id', AddressController.deleteAddress)

module.exports = addressRouter