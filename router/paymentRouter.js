const
    express = require('express'),
    paymentRouter = express.Router(),
    { PaymentController } = require('../controller/paymentController'),
    passport = require('passport'),
    Auth = require('../lib/auth')

paymentRouter
    .get('/', PaymentController.getAllPayment)

paymentRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeAdmin)

paymentRouter
    .post('/', PaymentController.createNewPayment)
    .put('/:id', PaymentController.updatePayment)
    .delete('/:id', PaymentController.deletePayment)

module.exports = paymentRouter 