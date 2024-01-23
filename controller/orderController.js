const
    { responseJSON } = require('../helpers/response.js'),
    { Order, User, PaymentMethod } = require('../models')

class OrderController {

    static getAllOrders = async (_, res) => {

        let orders
        let status
        let statusCode = 200
        let message

        try {
            orders = await Order.findAll({})

            if (!orders.value) {
                throw error
            }

        } catch (error) {
            status = 'failed'
            message = 'No orders found'
            statusCode = 404
        }
        res.status(statusCode).json(responseJSON(orders, status, message))
    }

    static createNewOrder = async (req, res) => {

        let { userId, paymentId, address } = req.body
        let status = 'success'
        let statusCode = 201
        let messages = {}
        let data = {}

        if (userId == null) messages.user = 'UserId tidak boleh kosong'
        if (paymentId == null) messages.payment = 'PaymentId tidak boleh kosong'

        if (Object.keys(messages).length != 0) {
            status = 'failed'
            statusCode = 400
            return res.status(statusCode).json(responseJSON(null, status, messages))
        }

        try {

            let [userFound, paymentFound] = await Promise.allSettled([

                User.findOne({
                    where: {
                        id: userId
                    }
                }),
                PaymentMethod.findOne({
                    where: {
                        id: paymentId
                    }
                })

            ])

            if (!userFound.value) {
                messages.user = `User with id ${userId} not found`
            }

            if (!paymentFound.value) {
                messages.payment = `Payment Method with id ${paymentId} not found`
            }

            if (Object.keys(messages).length != 0) {
                throw error
            }

            data = {
                userId: userId,
                paymentId: paymentId,
                status: "waiting for order",
                address: address ? address : userFound.value.address,
                totalPrice: null
            }
            //Note: Lognya hapus kalau tidak terpakai
            console.log(data)

            await Order.create(data)

        } catch (error) {
            status = 'failed'
            statusCode = 404
            data = null
            console.log("Error : ", error)
        }

        return res.status(statusCode).json(responseJSON(data, status, messages))

    }

    static updateOrder = async (req, res) => {

        let id = +req.params.id
        let statusCode = 200
        let status
        let message
        let order

        try {

            order = await Order.findOne({
                where: {
                    id: id
                }
            })

            if (!order) {
                status = 'failed'
                statusCode = 404
                message = `Category with id ${id} not found`
                throw error
            }

            if (order.dataValues.status === 'order complete') {
                status = 'failed'
                statusCode = 409
                message = `Order with id ${id} has been confirmed, please make a new order`
                throw error
            }

            if(order.dataValues.status === "waiting for order") {
                status = 'failed'
                statusCode = 409
                message = `Please add some product to order`
                throw error
            }

            await Order.update({
                status : 'order complete'
            }, {
                where :{
                    id : id
                }
            })

        } catch (error) {
            return res.status(statusCode).json(responseJSON(null, status, message))
        }

        return res.status(statusCode).json(responseJSON(null))

    }

}


module.exports = { OrderController }