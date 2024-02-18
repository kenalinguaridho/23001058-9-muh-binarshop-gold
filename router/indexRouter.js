const
    express = require('express'),
    indexRouter = express.Router(),
    userRouter = require('./userRouter'),
    categoryRouter = require('./categoryRouter'),
    productRouter = require('./productRouter'),
    paymentRouter = require('./paymentRouter'),
    orderRouter = require('./orderRouter'),
    orderProductRouter = require('./orderProductRouter')

// ================ Router Collection ================

indexRouter.use('/users', userRouter)
indexRouter.use('/products', productRouter)
indexRouter.use('/orders', orderRouter)
indexRouter.use('/orderproducts', orderProductRouter)
indexRouter.use('/categories', categoryRouter)
indexRouter.use('/payments', paymentRouter)


module.exports = indexRouter