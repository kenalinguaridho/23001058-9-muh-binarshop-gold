const
    express = require('express'),
    addressRouter = express.Router(),
    passport = require('passport'),
    Auth = require('../lib/auth.js'),
    { AddressController } = require('../controller/addressController.js');

addressRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeUser)

addressRouter
    .get('/', AddressController.getAllAddresses)
    .get('/:id', AddressController.getUserAddressById)
    .post('/', AddressController.createNewAddress)
    .put('/:id', AddressController.updateAddress)
    .patch('/:id', AddressController.updateMainAddress)
    .delete('/:id', AddressController.deleteAddress)

module.exports = addressRouter