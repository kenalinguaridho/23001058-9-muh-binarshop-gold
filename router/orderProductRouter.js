const
    express = require('express'),
    orderProductRouter = express.Router(),
    passport = require('../lib/passport'),
    Auth = require('../lib/auth'),
    { OrderProductController } = require('../controller/orderProductController.js');


orderProductRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeUser)
orderProductRouter.get('/', OrderProductController.getAllOrderProduct)
orderProductRouter.post('/', OrderProductController.createNewOrderProduct)

module.exports = orderProductRouter 