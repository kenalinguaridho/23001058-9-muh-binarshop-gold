const { CustomError } = require("../errors/customError")

class DataManipulationService {
    static create = async (model, payload, options) => {
        try {
            const newData = await model.create(payload, options)
            return newData
        } catch (error) {
            throw error
        }
    }

    static findById = async (model, identifier, options) => {
        try {
            const data = await model.findByPk(identifier, options)

            if (!data) throw new CustomError('No record found', 404)

            return data
        } catch (error) {
            throw error
        }
    }

    // static getAll = async (model) => {

    // }

    // static getById = async ()
}

module.exports = { DataManipulationService }