const
    express = require('express'),
    orderRouter = express.Router(),
    passport = require('../lib/passport.js'),
    Auth = require('../lib/auth.js'),
    { OrderController } = require('../controller/orderController.js');


orderRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeUser)
orderRouter.get('/', OrderController.getAllOrders)
orderRouter.get('/:id', OrderController.getOrderById)
orderRouter.post('/', OrderController.createNewOrder)
orderRouter.patch('/:id', OrderController.updateOrder)

module.exports = orderRouter
