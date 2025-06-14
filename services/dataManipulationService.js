module.exports = class DataManipulationService {
    static create = async ({ model, payload, options }) => {

        return await model.create(payload, options)

    }

    static findAll = async ({ model, options }) => {

        return await model.findAll(...options)

    }

    static findById = async (model, id, options) => {

        return await model.findByPk(id, options)

    }

    static update = async ({ model, payload, id, options }) => {

        return await model.update(payload, {
            where: { id: id },
            ...options
        })

    }

    static delete = async ({ model, id, options }) => {

        return await model.destroy({
            where: { id },
            ...options
        })

    }

    static increment = async ({ object, field, value, options }) => {

        return await object.increment(
            field,
            { by: value },
            options
        )

    }

}