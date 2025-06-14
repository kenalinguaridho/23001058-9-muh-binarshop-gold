require('dotenv').config()
const
    express = require('express'),
    app = express(),
    indexRouter = require('./router/indexRouter.js'),
    morgan = require('morgan'),
    PORT = process.env.PORT,
    { CustomError } = require('./errors/customError.js'),
    { ValidationError, UniqueConstraintError } = require('sequelize')
    
app.use(express.json())
app.use(morgan('dev'))

app.use('/api', indexRouter)

app.use((err, req, res, next) => {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
        err = CustomError.sequelizeError(err);
    }

    res.status(err.statusCode || 500).json({
        status: 'Failed',
        errors: err.message || 'Internal Server Error',
        details: err.details || {},
    });
})

app.use((req, res, next) => {
    res.status(404).json({
        status:'Failed',
        errors:'API endpoint not found'
    })
})

app.listen(PORT, () => {
    console.log(`Listen and run server on http://localhost:${PORT}`)
})