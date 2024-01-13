const
    express = require('express'),
    app = express(),
    PORT = 3069,
    userRouter = require('./router/userRouter.js'),
    itemRouter = require('./router/itemRouter.js'),
    orderRouter = require('./router/orderRouter.js'),
    morgan = require('morgan')

app.use(express.json())
app.use(morgan('dev'))

app.use('/auth', userRouter)
app.use('/items', itemRouter)
app.use('/orders', orderRouter)

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