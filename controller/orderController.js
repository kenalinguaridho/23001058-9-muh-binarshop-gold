const
    { responseJSON } = require('../helpers/response.js'),
    { Op } = require("sequelize"),
    { Order, OrderProduct, Address, PaymentMethod, Product, sequelize } = require('../models'),
    cron = require('node-cron');

class OrderController {

    // Get All User's Order
    static getAllOrders = async (req, res) => {

        try {

            const orders = await Order.findAll({
                where: {
                    userId: req.user.id
                }
            })

            return res.status(200).json(responseJSON(orders))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed to fetch data'))

        }

    }

    // Get Order Details for User as Customer
    static getOrderById = async (req, res) => {

        try {

            const id = req.params.id

            // Find One Order And Assign Attributes Needed
            const order = await Order.findOne({
                where: {
                    [Op.and]: [{ id: id }, { userId: req.user.id }]
                },
                attributes: ['id', 'status', 'totalPrice'],
                include: [{
                    model: OrderProduct,
                    as: 'orderProducts',
                    attributes: ['productId', 'amount', 'subTotal']
                },
                {
                    model: Address,
                    as: 'address',
                    attributes: ['address', 'note', 'receiver', 'phone']
                },
                {
                    model: PaymentMethod,
                    as: 'paymentMethod',
                    attributes: ['name']
                }],
            })

            // If no order found It return error
            if (!order) {
                return res.status(404).json(responseJSON(null, 'failed', `you have no order with id ${id}`))
            }

            // If order found it return order details
            return res.status(200).json(responseJSON(order))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed to fetch data'))

        }

    }

    // Create New Order
    static createNewOrder = async (req, res) => {

        // Transaction begin
        const t = await sequelize.transaction()

        try {

            // Define variable by request body
            let { paymentId, products } = req.body

            // Early variable declaration
            let productArray = []
            let product
            let total_price = 0

            // Order will be expired 2 hours after order created
            const expired = new Date(new Date().setMinutes(new Date().getMinutes() + 1))

            // Find User's active address to deliver the order
            const activeAddress = await Address.findOne({
                where: {
                    [Op.and]: [{ userId: req.user.id }, { isMain: true }]
                }
            })

            if (!activeAddress) {
                return res.status(400).json(responseJSON(null, 'failed', 'no delivery address found'))
            }

            // Find payment method that user want to use
            const payment = await PaymentMethod.findByPk(paymentId)

            // Check if the payment method is available
            if (!payment) {
                return res.status(404).json(responseJSON(null, 'failed', `no payment method with id ${paymentId}`))
            }

            // Define data to insert on order table
            let orderPayload = {
                userId: req.user.id,
                paymentId: paymentId,
                status: 'waiting for payment',
                expiresOn: expired,
                addressId: activeAddress.dataValues.id,
                totalPrice: 0
            }

            // Insert order data to db
            const order = await Order.create(orderPayload, { transaction: t })

            // Loop to check every product to order
            for (let i = 0; i < products.length; i++) {

                // Find the product that user want to order
                product = await Product.findByPk(products[i].id)

                // Check if the product is exist
                if (!product) {
                    return res.status(404).json(responseJSON(null, 'failed', `no product with id ${products[i].id}`))
                }

                // Check product stock before order
                if (product.dataValues.stock < products[i].amount) {
                    return res.status(400).json(responseJSON(null, 'failed', `product with id ${products[i].id} is out of amount`))
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

                // Decrease product stock after create order
                await product.increment({ 'stock': -products[i].amount }, { transaction: t })

                // Store all payload into an array to bulk insert
                productArray.push(orderProductPayload)

            }

            // Bulk insert into OrderProduct table
            await OrderProduct.bulkCreate(productArray, { transaction: t })

            // Update totalPrice in Order table
            await order.increment({ 'totalPrice': total_price }, { transaction: t })

            // Commit all the changes to database after complete all step
            await t.commit()

            return res.status(201).json(responseJSON(productArray))

        } catch (error) {

            console.log(error);
            // Rolling back the change before meet failed case
            await t.rollback()

            return res.status(500).json(responseJSON(null, 'failed', 'failed while create order'))

        }

    }

    // Update Order Status to success
    static updateOrder = async (req, res) => {

        try {

            const id = req.params.id
            const userId = req.user.id

            // Find the order that you want to update
            const order = await Order.findOne({
                where: {
                    [Op.and]: [{ id: id }, { userId: userId }]
                }
            })

            // If no order found it return error 404
            if (!order) {
                return res.status(404).json(responseJSON(null, 'failed', `you have no order with id ${id}`))
            }

            // If order found is success or failed it will return error 400
            if (order.dataValues.status === 'success') {
                return res.status(400).json(responseJSON(null, 'failed', 'your order has been completed, make a new order'))
            } else if (order.dataValues.status === 'failed') {
                return res.status(400).json(responseJSON(null, 'failed', 'your order is expired, make a new order'))
            }

            // After all guard is passed it will update the order status to success
            await order.update({
                status: 'success'
            })

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed while update order status'))

        }

    }

    // Update Order Status that is executed by cron
    static updateExpiredOrder = async (req, res) => {

        // Transaction initiation
        const t = await sequelize.transaction()

        try {

            // Find order with certain attributes
            const orders = await Order.findAll({
                where: {
                    expiresOn: {
                        [Op.lt]: new Date()
                    },
                    status: 'waiting for payment'
                },
                attributes: ['id']
            })
            
            if (orders.length > 0) {
                for (let i = 0; i < orders.length; i++) {
                    await Order.update({
                        status: 'failed'
                    }, {
                        where: {
                            id: orders[i].id
                        },
                        transaction: t
                    })
                    
                }
                
                for (let i = 0; i < orders.length; i++) {
                    const orderProducts = await OrderProduct.findAll({
                        where: {
                            orderId: orders[i].id
                        }
                    })

                    for (let i = 0; i < orderProducts.length; i++) {
                        await Product.increment({
                            stock: orderProducts[i].amount
                        }, {
                            where: {
                                id: orderProducts[i].productId
                            },
                            transaction: t
                        })
                    }

                }

            }

            // Commit after transaction complete
            await t.commit()

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            // Rollback after transaction failed
            await t.rollback()

            return res.status(500).json(responseJSON(null, 'failed', 'failed while update data'))

        }

    }

}

// Sceduled execute update status for expired order
// Order status is updated every 10s
cron.schedule('*/20 * * * * *', async () => {
    await OrderController.updateExpiredOrder()
})


module.exports = { OrderController }