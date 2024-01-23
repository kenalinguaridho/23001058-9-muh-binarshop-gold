const { PaymentMethod } = require('../models')
const { responseJSON } = require('../helpers/response');

class PaymentController {
    static getPayment = async(req, res) => {
        let statusCode = 200
        let status
        let message
        let payments

        try {

            payments = await PaymentMethod.findAll({})
            //Note: Console log bisa dihapus kalau tidak terpakai
            console.log(payments)
            if (!payments) {
                throw error
            }

        } catch (error) {

            status = 'failed'
            statusCode = 404
            message = 'No payment found'
            payments = null

        }

        return res.status(statusCode).json(responseJSON(payments, status, message))
    }
}

module.exports = { PaymentController }