const { CustomError } = require('../errors/customError.js')
const
    { responseJSON } = require('../helpers/response.js'),
    { unlinkMultiple } = require('../helpers/unlinkMedia.js'),
    { Product, Category, Image, sequelize } = require('../models'),
    Cloudinary = require('../lib/cloudinary.js')

class ProductController {

    static getAllProducts = async (req, res) => {

        try {

            console.log("Get all products start", req.route.methods);
            

            let page = req.query.page

            if (!page) page = 1

            const products = await sequelize.query(`SELECT p.id, p.name, p.price, i.url AS image FROM "Products" p LEFT JOIN ( SELECT "parentId", url, ROW_NUMBER() OVER (PARTITION BY "parentId" ORDER BY id) AS rn FROM "Images" ) i ON p.id = i."parentId" AND i.rn = 1 WHERE ("p"."deletedAt" is NULL) order by "p"."createdAt" limit 10 offset (${page} - 1) * 10`)
            
            const arrayProducts = products[0]
            
            arrayProducts.forEach(product => {
                if (product.image === null) {
                    product.image = ""
                }
            });

            return res.status(200).json(responseJSON(arrayProducts))

        } catch (error) {

            console.log(error);
            return res.status(500).json(responseJSON(null, 'failed', 'error while fetching data'))

        }

    }

    static getProductById = async (req, res, next) => {

        try {

            const id = req.params.id

            const product = await Product.findOne({
                where: {
                    id
                },
                attributes: ['name', 'description', 'price', 'stock'],
                include: [{
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }, {
                    model: Image,
                    as: 'images',
                    attributes: ['url']
                }],

            })

            if (!product) {
                throw new CustomError('Data not found', 404, `Product with id ${id} not found`)
            }

            return res.status(200).json(responseJSON(product))

        } catch (error) {

            next(error)

        }


    }

    static createNewProduct = async (req, res) => {

        const t = await sequelize.transaction()

        let arrOfPublicId = []

        try {

            const { sku, categoryId, name, description, price, stock } = req.body

            const payload = {
                sku: sku,
                categoryId: +categoryId,
                name: name,
                description: description,
                price: +price,
                stock: +stock
            }

            const category = await Category.findOne({
                where: {
                    id: categoryId
                }
            })

            if (!category) {
                return res.status(404).json(responseJSON(null, 'failed', `no category with id ${payload.categoryId}`))
            }

            const product = await Product.create(payload, { transaction: t })

            if (req.files.length > 0) {

                let imagesPayload = []

                for (let i = 0; i < req.files.length; i++) {
                    console.log("PATH ==> ", req.files[i].path);
                    
                    let imageResult = await Cloudinary.upload(req.files[i].path)
                                       
                    arrOfPublicId.push(imageResult.public_id)

                    let imagePayload = {
                        usage: 'product',
                        parentId: product.dataValues.id,
                        url: imageResult.secure_url,
                        publicId: imageResult.public_id
                    }

                    imagesPayload.push(imagePayload)
                }
                await Image.bulkCreate(imagesPayload, { transaction: t })

                unlinkMultiple(req.files)
            }

            await t.commit()

            return res.status(201).json(responseJSON(product))

        } catch (error) {

            await t.rollback()

            let errorMessage

            if (arrOfPublicId.length != 0) {
                unlinkMultiple(req.files)
                await Cloudinary.rollback(arrOfPublicId)
                errorMessage = 'error while upload images'
            }

            let statusCode

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
                errorMessage = error.errors[0].message
            } else if (error.name === 'SequelizeValidationError') {
                errorMessage = error.errors[0].message
                statusCode = 400
            }

            return res.status(statusCode || 500).json(responseJSON(null, 'failed', errorMessage))

        }

    }

    static editProduct = async (req, res) => {

        let incomingPublicIds = []

        const t = await sequelize.transaction()
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

            const images = await Image.findAll({
                where: {
                    parentId: id
                }
            })

            let currentPublicIds = []

            for (let j = 0; j < images.length; j++) {
                currentPublicIds.push(images[j].dataValues.publicId)
            }

            if (req.files) {
                // Here is logic for upload images and store data needed to db

                let imagesPayload = []

                for (let i = 0; i < req.files.length; i++) {
                    let incomingImage = await Cloudinary.upload(req.files[i].path)

                    incomingPublicIds.push(incomingImage.public_id)

                    let imagePayload = {
                        usage: 'product',
                        parentId: product.dataValues.id,
                        url: incomingImage.secure_url,
                        publicId: incomingImage.public_id
                    }

                    imagesPayload.push(imagePayload)

                }

                await Image.bulkCreate(imagesPayload, { transaction: t })

                unlinkMultiple(req.files)
            }

            await product.update(payload, {
                transaction: t
            })

            if (images.length > 0) {
                await Image.destroy({
                    where: {
                        publicId: currentPublicIds
                    },
                    transaction: t
                })

                await Cloudinary.rollback(currentPublicIds)
            }

            await t.commit()

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            let statusCode = 500

            await t.rollback()

            if (req.files.length > 0) {
                unlinkMultiple(req.files)
            }

            if (incomingPublicIds.length > 0) {
                await Cloudinary.rollback(incomingPublicIds)
            }

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', 'error while updating data'))

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

            const newStock = +req.body.stock

            if (!newStock) {
                return res.status(400).json(responseJSON(null, 'failed', 'new stock must be in request body'))
            }

            const product = await Product.findByPk(req.params.id)

            if (!product) {
                return res.status(404).json(responseJSON(null, 'failed', `no product with id ${id}`))
            }

            await product.increment({ 'stock': newStock })

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
