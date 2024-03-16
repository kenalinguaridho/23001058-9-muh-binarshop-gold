const { responseJSON } = require('../helpers/response');
const { Category, Product } = require('../models')

class CategoryController {
    static getAllCategories = async (_, res) => {

        let statusCode = 200

        try {

            const categories = await Category.findAll(
                {
                    attributes: ['id', 'name'],
                })

            if (!categories) {
                statusCode = 404
                throw error
            }

            return res.status(statusCode).json(responseJSON(categories))

        } catch (error) {

            let status = 'failed'
            let message = 'No category found'

            return res.status(statusCode).json(responseJSON(null, status, message))
        }


    }

    static getCategoryById = async (req, res) => {

        let id = +req.params.id
        let statusCode = 200
        let status
        let message
        let category

        try {

            category = await Category.findByPk(
                id,
                {
                    attributes: ['name'],
                    include: [{
                        model: Product,
                        as: 'products',
                        attributes: {
                            exclude: ['categoryId', 'sku', 'stock', 'createdAt', 'updatedAt', 'deletedAt']
                        }
                    }],

                })

            if (!category) {
                statusCode = 404
                message = `Category with id ${id} not found`
                throw error
            }

            return res.status(statusCode).json(responseJSON(category))

        } catch (error) {

            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, message))

        }


    }

    static createNewCategory = async (req, res) => {

        let statusCode = 200
        let status

        try {

            const data = {
                name: req.body.name ?? ''
            }

            await Category.create(data)

            return res.status(statusCode).json(responseJSON(data))

        } catch (error) {

            status = 'failed'
            statusCode = 400
            return res.status(statusCode).json(responseJSON(null, status, error.errors[0].message ?? error))

        }

    }

    static updateCategory = async (req, res) => {

        let id = req.params.id
        let statusCode = 200
        let message


        try {

            let category = await Category.findByPk(id)

            if (!category) {
                message = `No category with id ${id}`
                statusCode = 404
                throw error
            }

            const newData = {
                name: req.body.name ?? category.dataValues.name
            }

            await Category.update(
                newData,
                {
                    where: {
                        id: id
                    }
                })

            return res.status(statusCode).json(responseJSON(newData))

        } catch (error) {

            let status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, message))

        }


    }

    static deleteCategory = async (req, res) => {

        let id = +req.params.id
        let statusCode = 200
        let message

        try {

            let category = await Category.findOne({
                where: {
                    id: id
                }
            })

            if (!category) {
                message = `No category with id ${id}`
                statusCode = 404
                throw error
            }

            await Category.destroy({
                where: {
                    id: id
                }
            })

            return res.status(statusCode).json(responseJSON(null))

        } catch (error) {

            let status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, message))

        }

    }

}

module.exports = { CategoryController }