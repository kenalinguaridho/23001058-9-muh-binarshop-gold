const { responseJSON } = require('../helpers/response');
const { Category, Product } = require('../models')

class CategoryController {
    static getAllCategories = async (_, res) => {

        try {

            const categories = await Category.findAll(
                {
                    attributes: ['id', 'name'],
                })

            return res.status(200).json(responseJSON(categories))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'error while fetching data'))

        }

    }

    static getCategoryById = async (req, res) => {

        try {

            let id = +req.params.id

            const category = await Category.findByPk(
                id,
                {
                    attributes: ['name'],
                    include: [{
                        model: Product,
                        as: 'products',
                        attributes: ['id', 'name', 'price', 'stock']
                    }],

                })

            if (!category) {
                return res.status(404).json(responseJSON(null, 'failed', `no category with id ${id}`))
            }

            return res.status(200).json(responseJSON(category))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'error while fetching data'))

        }


    }

    static createNewCategory = async (req, res) => {

        try {

            const payload = {
                name: req.body.name
            }

            const category = await Category.create(payload)

            return res.status(201).json(responseJSON(category))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while creating new category'))

        }

    }

    static updateCategory = async (req, res) => {

        try {

            let id = +req.params.id

            const category = await Category.findByPk(id)

            if (!category) {
                return res.status(404).json(responseJSON(null, 'failed', `no category with id ${id}`))
            }

            const payload = {
                name: req.body.name ?? category.dataValues.name
            }

            await category.update(payload)

            return res.status(200).json(responseJSON(category))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while updating category'))

        }


    }

    static deleteCategory = async (req, res) => {

        try {

            const id = +req.params.id

            const category = await Category.findByPk(id)

            if (!category) {
                return res.status(404).json(responseJSON(null, 'failed', `no category with id ${id}`))
            }

            await Category.destroy({
                where: {
                    id: id
                }
            })

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'error while deleting category'))

        }

    }

}

module.exports = { CategoryController }