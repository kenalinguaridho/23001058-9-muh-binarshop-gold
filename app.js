require('dotenv').config()
const
    express = require('express'),
    app = express(),
    indexRouter = require('./router/indexRouter.js'),
    morgan = require('morgan'),
    { CustomError } = require('./errors/customError.js'),
    { ValidationError, UniqueConstraintError } = require('sequelize')

let PORT    
    
app.use(express.json())
app.use(morgan('dev'))

if (process.env.NODE_ENV === "development") {
    PORT = 3069
} else {
    PORT = 6969
}

app.use('/api', indexRouter)

app.use((err, req, res, next) => {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        err = CustomError.sequelizeError(err);
    }

    res.status(err.statusCode || 500).json({
        status: 'failed',
        errors: err.message || 'Internal Server Error',
        details: err.details || {},
    });
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