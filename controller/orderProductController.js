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
                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price']
                    }]
            })

            // console.log(orderProducts)

        } catch (error) {
            console.log(error)
        }

        return res.status(200).json(responseJSON(orderProducts, 'ok'))

    }

    static createNewOrderProduct = async (req, res) => {

        // Read properties from request body 
        let { orderId, products } = req.body

        // Early variable declaration
        let statusCode = 201
        let messages = {}
        let productArray = []
        let product
        let total_price = 0

        const t = await sequelize.transaction()

        try {

            // Find the order
            let order = await Order.findByPk(orderId)

            // Check if the order exist in db
            if (order == null) {
                messages.order = `Order with id ${orderId} not found`
                throw error
            }

            // Check the order status, is it a complete order or not
            if (order.dataValues.status === 'order complete') {
                messages.order = 'Order has been completed, please make a new order'
                throw error
            }

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

                let data = {
                    orderId: orderId,
                    productId: products[i].id,
                    amount: products[i].amount,
                    subTotal: sub_total
                }

                productArray.push(data)

                await OrderProduct.create(data, { transaction: t })

            }

            // Update Order with new totalPrice and status
            await Order.update(
                {
                    totalPrice: order.dataValues.totalPrice + total_price,
                    status: "waiting to confirm",
                },
                {
                    where: {
                        id: orderId
                    },

                },
                {
                    transaction: t
                })

            // After all the things above complete it will commit to store al the data and changes
            await t.commit()

        } catch (error) {

            await t.rollback()

            return res.status(statusCode).json(responseJSON(null, 'failed', messages))

        }

        return res.status(statusCode).json(responseJSON(productArray))

    }
}

module.exports = { OrderProductController }