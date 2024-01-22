const
    express = require('express'),
    orderProductRouter = express.Router(),
    { OrderProductController } = require('../controller/orderProductController.js');

orderProductRouter.post('/', OrderProductController.createNewOrderProduct)

module.exports =  orderProductRouter 