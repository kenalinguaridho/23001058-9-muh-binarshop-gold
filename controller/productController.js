const
    { responseJSON } = require('../helpers/response.js'),
    { Op } = require("sequelize"),
    { Product, Category } = require('../models')

class ProductController {

    static getAllProducts = async (_, res) => {

        let statusCode = 200
        let status
        let message
        let products

        try {

            products = await Product.findAll({
                attributes: ['id', 'categoryId', 'sku', 'name', 'description', 'price', 'stock']
            })

            if (products.length === 0) {
                throw error
            }

        } catch (error) {

            statusCode = 404
            status = 'failed'
            message = 'No product found'

        }
        return res.status(statusCode).json(responseJSON(products, status, message))
    }

    static getProductById = async (req, res) => {

        const id = +req.params.id
        let statusCode = 200
        let status = 'success'
        let message

        let result = {}

        try {

            result = await Product.findOne({
                where: {
                    id: id
                },
                attributes: ['sku', 'name', 'description', 'price', 'stock'],
                include: [{
                    model: Category,
                    attributes: ['id', 'name']
                }]

            })

            if (result == null) {
                throw error
            }
            //Note: Console.log bisa dihapus aja kalo tidak terpakai
            console.log(result.dataValues)

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = `No product with id ${id}`
            result = null

        }

        return res.status(statusCode).json(responseJSON(result, status, message))

    }

    static createNewProduct = async (req, res) => {

        let { sku, categoryId, name, description, price, stock } = req.body
        let statusCode = 201
        let status = 'success'
        let messages = {}

        if (sku == undefined) sku = ""
        if (categoryId == undefined) categoryId = ""
        if (name == undefined) name = ""
        if (description == undefined) description = ""
        if (price == undefined) price = ""
        if (stock == undefined) stock = ""

        if (sku === "") messages.sku = "sku cannot be empty"
        if (categoryId === "") messages.categoryId = "categoryId cannot be empty"
        if (name === "") messages.name = "name cannot be empty"
        if (description === "") messages.description = "description cannot be empty"
        if (price === "") messages.price = "price cannot be empty"
        if (stock === "") messages.stock = "stock cannot be empty"

        if (Object.keys(messages).length != 0) {
            status = 'failed'
            return res.status(400).json(responseJSON(null, status, messages))
        }

        let data = {
            sku: sku,
            categoryId: categoryId,
            name: name,
            description: description,
            price: price,
            stock: stock
        }

        try {

            let skuDuplicated = await Product.findOne({
                where: {
                    sku: data.sku
                }
            })

            if (skuDuplicated != null) {
                statusCode = 409
                messages.username = 'sku is already used'
                throw error
            }

            //Note: gapake await?
            Product.create(data)

        } catch (error) {

            status = 'failed'
            data = null

        }

        return res.status(statusCode).json(responseJSON(data, status, messages))

    }

    static editProduct = async (req, res) => {

        let id = +req.params.id
        let { sku, categoryId, name, description, price, stock } = req.body
        let statusCode = 200
        let status
        let messages

        if (sku == undefined) sku = ""
        if (categoryId == undefined) categoryId = ""
        if (name == undefined) name = ""
        if (description == undefined) description = ""
        if (price == undefined) price = ""
        if (stock == undefined) stock = ""

        try {


            let product = await Product.findOne({
                where: {
                    id: id
                }
            })

            if (!product) {
                statusCode = 404
                throw error
            }

            //Note: Karena cuma 1 await gaperlu pakai allSettled
            let [skuDuplicated] = await Promise.allSettled([
                Product.findOne({
                    where: {
                        sku: sku,
                        id: {
                            [Op.ne]: +req.params.id
                        }
                    }
                })
            ])

            if (skuDuplicated.value != null) {
                statusCode = 409
                messages = 'sku is already used'
                throw error
            }

            let data = {
                sku: sku ? sku : product.dataValues.sku,
                categoryId: categoryId ? categoryId : product.dataValues.categoryId,
                name: name ? name : product.dataValues.name,
                description: description ? description : product.dataValues.description,
                price: price ? price : product.dataValues.price,
                stock: stock ? stock : product.dataValues.stock
            }

            await Product.update(data, {
                where: {
                    id: id
                }
            })


        } catch (error) {

            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, messages))

        }

        return res.status(statusCode).json(responseJSON(null))

    }

    static deleteProduct = async (req, res) => {

        let id = +req.params.id
        let status
        let statusCode = 200
        let message

        try {
            await Product.destroy({
                where : {
                    id:id
                }
            })
        } catch (error) {
            status = 'failed'
            message = `Product with id ${id} not found`
        }
        
        return res.status(statusCode).json(responseJSON(null, status, message))

    }
}



module.exports = { ProductController }
