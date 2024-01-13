const
    express = require('express'),
    orderRouter = express.Router(),
    { OrderController } = require('../controller/orderController.js');

orderRouter.get('/', OrderController.getAllOrders)
orderRouter.post('/', OrderController.createNewOrder)
orderRouter.patch('/:id', OrderController.updateOrder)

module.exports = orderRouter
