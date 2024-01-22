const
    { responseJSON } = require('../helpers/response.js'),
    { Order, Product, OrderProduct } = require('../models')

class OrderProductController {

    static createNewOrderProduct = async (req, res) => {
        let { orderId, products } = req.body

        let status = 'success'
        let statusCode = 201
        let messages = {}


        let productArray = []
        let product
        let total_price = 0

        try {

            // Find the order
            let order = await Order.findOne({
                where: {
                    id: orderId
                }
            })

            if (order == null) {
                messages.order = `Order with id ${orderId} not found`
                throw error
            }

            if (!order) throw new Error("No order Found")

            // Loop to check every product to order
            for (let i = 0; i < products.length; i++) {

                // Find the product that user want to order
                product = await Product.findOne({
                    where: {
                        id: products[i].id
                    }
                })

                if (!product) {
                    messages.product = `product with id ${products[i].id} not found`
                    statusCode = 404
                }

                if (product.dataValues.stock < products[i].amount) {
                    messages.product = `product with id ${product.dataValues.id} is out of amount, ${product.dataValues.stock} left`
                    statusCode = 409
                }

                let sub_total = products[i].amount * product.dataValues.price
                total_price += sub_total

                let data = {
                    orderId: orderId,
                    productId: product.dataValues.id,
                    amount: products[i].amount,
                    subTotal: sub_total
                }

                productArray.push(data)
            }

            if (Object.keys(messages).length != 0) throw error

            // Insert array of product to order to OrderProducts
            await OrderProduct.bulkCreate(productArray)

            // Update Order with new totalPrice and status
            await Order.update({

                totalPrice: order.dataValues.totalPrice + total_price,
                status: "waiting to confirm",
            }, {
                where: {
                    id: orderId
                },

            })

            // Accumulate product stock with amount/quantity of ordered product
            for (let i = 0; i < products.length; i++) {
                await Product.update({
                    stock: product.dataValues.stock - products[i].amount

                },
                    {
                        where: {
                            id: products[i].id
                        },
                    })
            }

            console.log("ERROR IS HERE")

        } catch (error) {

            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, messages))

        }

        return res.status(statusCode).json(responseJSON(productArray, status))

    }
}

module.exports = { OrderProductController }