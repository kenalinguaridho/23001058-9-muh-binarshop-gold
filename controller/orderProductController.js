const
    { responseJSON } = require('../helpers/response.js'),
    { Order, Product, OrderProduct, User, sequelize } = require('../models')

class OrderProductController {

    static getAllOrderProduct = async (req, res) => {

        let orderProducts
        try {
            orderProducts = await OrderProduct.findAll({
                attributes: ['id', 'amount', 'subTotal'],
                include:
                    [{
                        model: Order,
                        as: 'order',
                        attributes: ['id'],
                        include: {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'name', 'username']
                        },
                        where : {
                            userId: req.user.id
                        }
                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price']
                    }]
            })

        } catch (error) {
            console.log(error)
        }

        return res.status(200).json(responseJSON(orderProducts, 'ok'))

    }

    static createNewOrderProduct = async (req, res) => {

        // Read properties from request body 
        let { paymentId, products, address } = req.body

        // Early variable declaration
        let statusCode = 201
        let messages = {}
        let productArray = []
        let product
        let total_price = 0

        // Transaction begin
        const t = await sequelize.transaction()

        try {

            const user = await User.findByPk(req.user.id)

            let orderPayload = {
                userId: req.user.id,
                paymentId: paymentId,
                status: 'waiting to confirm',
                address: address ?? user.dataValues.address,
                totalPrice: 0
            }

            let order = await Order.create(orderPayload, { transaction: t })

            // Loop to check every product to order
            for (let i = 0; i < products.length; i++) {

                // Find the product that user want to order
                product = await Product.findByPk(products[i].id)

                // Check if the product is exist
                if (!product) {
                    messages.product = `product with id ${products[i].id} not found`
                    statusCode = 404
                    throw error
                }

                // Check product stock before order
                if (product.dataValues.stock < products[i].amount) {
                    messages.product = `product with id ${product.dataValues.id} is out of amount, ${product.dataValues.stock} left`
                    statusCode = 409
                    throw error
                }

                // Count the sub total of the order => amount of product * product price
                let sub_total = products[i].amount * product.dataValues.price
                total_price += sub_total

                // Create payload for orderProduct for each product inserted
                let orderProductPayload = {
                    orderId: order.dataValues.id,
                    productId: products[i].id,
                    amount: products[i].amount,
                    subTotal: sub_total
                }

                // Store all payload into an array to bulk insert
                productArray.push(orderProductPayload)

            }

            // Bulk insert into OrderProduct table
            await OrderProduct.bulkCreate(productArray, { transaction: t })

            // Update totalPrice in Order table
            await order.increment({ 'totalPrice': total_price }, { transaction: t })

            await t.commit()

        } catch (error) {

            await t.rollback()

            statusCode = 400

            return res.status(statusCode).json(responseJSON(null, 'failed', error))

        }

        return res.status(statusCode).json(responseJSON(productArray))

    }
}

module.exports = { OrderProductController }