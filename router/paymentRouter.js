const
    express = require('express'),
    paymentRouter = express.Router(),
    { PaymentController } = require('../controller/paymentController');

paymentRouter
    .get('/', PaymentController.getPayment)
    

module.exports = paymentRouter 