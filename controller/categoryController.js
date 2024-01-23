const { responseJSON } = require('../helpers/response');
const { Category } = require('../models')

class CategoryController {
    static getAllCategories = async (_, res) => {

        let statusCode = 200
        let status
        let message
        let categories

        try {

            categories = await Category.findAll(
                {
                    attributes: ['id', 'name'],
                })

            if (!categories) {
                //Note: Harusnya ini akan error karena error disini tidak didefinisikan terlebih dahulu. Harusnya penggunaannya seperti ini throw new Error('error messagenya')
                throw error
            }

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = 'No category found'
            categories = null

        }

        return res.status(statusCode).json(responseJSON(categories, status, message))

    }

    static getCategoryById = async (req, res) => {

        let id = +req.params.id
        let statusCode = 200
        let status
        let message
        let category

        try {

            category = await Category.findOne({
                where: {
                    id: id
                },
                attributes: ['name'],
            })

            if (!category) {
                throw error
            }

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = `Category with id ${id} not found`
            category = null

        }

        return res.status(statusCode).json(responseJSON(category, status, message))

    }

    static createNewCategory = async (req, res) => {

        let statusCode = 200
        let status
        let message
        let category

        try {

            category = await Category.create({
                name: req.body.name
            })

        } catch (error) {

            status = 'failed'
            message = 'failed to create new category'

        }

        return res.status(statusCode).json(responseJSON(category, status, message))

    }

    static updateCategory = async (req, res) => {

        let id = req.params.id
        let statusCode = 200
        let status
        let message
        let category

        let data = {
            name: req.body.name
        }


        try {

            category = await Category.findOne({
                where: {
                    id: id
                }
            })

            if (!category) {
                throw error
            }

            await Category.update(
                {
                    name: req.body.name
                },
                {
                    where: {
                        id: id
                    }
                })

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = `No category with id ${id}`
            data = null

        }

        return res.status(statusCode).json(responseJSON(data, status, message))

    }

    static deleteCategory = async (req, res) => {

        let id = +req.params.id
        let status = 'success'
        let statusCode = 200
        let message

        try {

            let category = await Category.findOne({
                where: {
                    id: id
                }
            })

            if (!category) {
                throw error
            }

            await Category.destroy({
                where: {
                    id: id
                }
            })

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = `No category with id ${id}`

        }

        return res.status(statusCode).json(responseJSON(null, status, message))

    }

}

module.exports = { CategoryController }