const
    express = require('express'),
    orderRouter = express.Router(),
    authenticate = require('../lib/auth.js'),
    { OrderController } = require('../controller/orderController.js');


orderRouter.use(authenticate)
orderRouter.get('/', OrderController.getAllOrders)
orderRouter.post('/', OrderController.createNewOrder)
orderRouter.patch('/:id', OrderController.updateOrder)

module.exports = orderRouter
