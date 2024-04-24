const
    express = require('express'),
    orderProductRouter = express.Router(),
    passport = require('../lib/passport.js'),
    Auth = require('../lib/auth.js'),
    { OrderProductController } = require('../controller/orderProductController.js');

orderProductRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeAdmin)

orderProductRouter
    .get('/', OrderProductController.getAllOrderProducts)

module.exports = orderProductRouter