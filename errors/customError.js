class CustomError extends Error {
    constructor(message, statusCode, details = {}) {
        super(message)
        this.statusCode = statusCode
        this.details = details
    }

    static sequelizeError = (sequelizeError) => {
        const errors = {}
        let statusCode = 400

        for (let i = 0; i < sequelizeError.errors.length; i++) {
            errors[sequelizeError.errors[i]["path"]] = sequelizeError.errors[i].message
        }

        if (sequelizeError.errors[0].type === 'unique violation') {
            statusCode = 409
        }

        return new CustomError(sequelizeError.errors[0].type, statusCode, errors)
    }

}

module.exports = { CustomError }