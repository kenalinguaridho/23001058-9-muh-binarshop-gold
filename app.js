require('dotenv').config()
const
    express = require('express'),
    app = express(),
    indexRouter = require('./router/indexRouter.js'),
    morgan = require('morgan'),
    PORT = process.env.PORT
    
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', indexRouter)

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