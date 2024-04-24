const
    express = require('express'),
    orderRouter = express.Router(),
    passport = require('../lib/passport.js'),
    Auth = require('../lib/auth.js'),
    { OrderController } = require('../controller/orderController.js');


orderRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeUser)
orderRouter
    .get('/', OrderController.getAllOrders)
    .get('/:id', OrderController.getOrderById)
    .post('/', OrderController.createNewOrder)
    .patch('/:id', OrderController.updateOrder)

module.exports = orderRouter
