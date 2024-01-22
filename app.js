const
    express = require('express'),
    app = express(),
    PORT = 3069,
    userRouter = require('./router/userRouter.js'),
    productRouter = require('./router/productRouter.js'),
    orderRouter = require('./router/orderRouter.js'),
    orderProductRouter = require('./router/orderProductRouter.js'),
    categoryRouter = require('./router/categoryRouter.js'),
    paymentRouter = require('./router/paymentRouter.js'),
    morgan = require('morgan')

app.use(express.json())
app.use(morgan('dev'))

app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/orders', orderRouter)
app.use('/orderproducts', orderProductRouter)
app.use('/categories', categoryRouter)
app.use('/payments', paymentRouter)


app.use((err, req, res, next) => {
    res.status(500).json({
        status: 'failed',
        errors: err.message
    })
})

app.use((req, res, next) => {
    res.status(404).json({
        status:'failed',
        errors:'API endpoint not found'
    })
})

app.listen(PORT, () => {
    console.log(`Listen and run server on http://localhost:${PORT}`)
})