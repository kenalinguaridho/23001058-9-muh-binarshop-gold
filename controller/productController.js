const
    { responseJSON } = require('../helpers/response.js'),
    { Op } = require("sequelize"),
    { Product, Category } = require('../models')

class ProductController {

    static getAllProducts = async (_, res) => {

        try {

            const products = await Product.findAll({
                attributes: ['id', 'categoryId', 'name', 'price', 'stock']
            })

            return res.status(200).json(responseJSON(products))

        } catch (error) {

            return res.status(statusCode).json(responseJSON(null, 'failed', 'error while fetching data'))

        }

    }

    static getProductById = async (req, res) => {

        try {

            const id = req.params.id

            const product = await Product.findOne({
                where: {
                    id: id
                },
                attributes: ['sku', 'name', 'description', 'price', 'stock'],
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }

            })

            if (!product) {
                return res.status(404).json(responseJSON(null, 'failed', `no product with id ${id}`))
            }

            return res.status(200).json(responseJSON(product))

        } catch (error) {

            console.log(error)
            return res.status(500).json(responseJSON(null, 'failed', 'error while fetching data'))

        }


    }

    static createNewProduct = async (req, res) => {

        try {

            const { sku, categoryId, name, description, price, stock } = req.body

            const payload = {
                sku: sku,
                categoryId: categoryId,
                name: name,
                description: description,
                price: price,
                stock: stock
            }

            const category = await Category.findOne({
                where: {
                    id: categoryId
                }
            })

            if (!category) {
                return res.status(404).json(responseJSON(null, 'failed', `no category with id ${payload.categoryId}`))
            }

            const product = await Product.create(payload)

            return res.status(201).json(responseJSON(product))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            } else if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while creating new product'))

        }


    }

    static editProduct = async (req, res) => {

        try {

            const id = req.params.id

            const { name, description, price } = req.body

            const product = await Product.findOne({
                where: {
                    id: id
                }
            })

            if (!product) {
                return res.status(404).jsn(responseJSON(null, 'failed', `no product with id ${id}`))
            }

            const payload = {
                name: name ? name : product.dataValues.name,
                description: description ? description : product.dataValues.description,
                price: price ? price : product.dataValues.price,
            }

            await Product.update(payload, {
                where: {
                    id: id
                }
            })

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(500).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while updating data'))

        }


    }

    static deleteProduct = async (req, res) => {

        try {

            const id = req.params.id

            const productDeleted = await Product.destroy({
                where: {
                    id: id
                }
            })

            if (productDeleted == 0) {
                return res.status(400).json(responseJSON(null, 'failed', 'no product was deleted'))
            }

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'error while deleting product'))

        }


    }

    static restock = async (req, res) => {
        try {

            const newStock = req.body.stock

            const product = await Product.findByPk(req.params.id)

            if (!product) {
                return res.status(404).json(responseJSON(null, 'failed', `no product with id ${id}`))
            }

            await product.update({
                stock: newStock + product.dataValues.stock
            })

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'failed while updating product stock'))

        }
    }
}

module.exports = { ProductController }
