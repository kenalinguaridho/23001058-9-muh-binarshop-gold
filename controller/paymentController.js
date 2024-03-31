const { PaymentMethod } = require('../models')
const { responseJSON } = require('../helpers/response');

class PaymentController {
    static getAllPayment = async(req, res) => {
        
        try {

            const payments = await PaymentMethod.findAll({
                attributes: ['id', 'name']
            })

            return res.status(200).json(responseJSON(payments))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed while fetching payment method'))

        }

    }

    static createNewPayment = async (req, res) => {
        try {
            
            const payload = {
                name: req.body.name
            }

            const payment = await PaymentMethod.create(payload)

            return res.status(201).json(responseJSON(payment))

        } catch (error) {
            
            return res.status(500).json(responseJSON(null, 'failed', 'failed while creating new payment method'))

        }
    }

    static updatePayment = async (req, res) => {
        try {

            const id = req.params.id

            const payment = await PaymentMethod.findOne({
                where: {
                    id
                }
            })

            if(!payment) {
                return res.status(404).json(responseJSON(null, 'failed', `no payment method with id ${id}`))
            }

            await payment.update({
                name: req.body.name
            })

            return res.status(200).json(responseJSON(payment))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed'))

        }
    }

    static deletePayment = async (req, res) =>{
        try {
            
            const id = req.params.id

            const payment = await PaymentMethod.findByPk(id)

            if (!payment) {
                return res.status(404).json(responseJSON(null, 'failed', `no payment method withid ${id}`))
            }

            await payment.destroy()

            return res.status(200).json(responseJSON(null))

        } catch (error) {
            return res.status(500).json(responseJSON(null, 'failed', 'failed while deleting payment method'))
        }
    }
}

module.exports = { PaymentController }