const { Op } = require('sequelize');
const { responseJSON } = require('../helpers/response');
const { Address, sequelize } = require('../models')

class AddressController {
    static getAllAddresses = async (req, res) => {
        try {
            const addresses = await Address.findAll({
                where: {
                    userId: req.user.id
                },
                attributes: ['id', 'address', 'receiver', 'phone', 'note', 'isMain']
            })

            return res.status(200).json(responseJSON(addresses))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed to fetch data from database'))

        }
    }

    static getUserAddressById = async (req, res) => {
        try {

            const id = req.params.id

            const address = await Address.findOne({
                where: {
                    [Op.and]: [{ id: id }, { userId: req.user.id }]
                },
                attributes: ['id', 'address', 'receiver', 'phone', 'note', 'isMain']
            })

            if (!address) {
                return res.status(404).json(responseJSON(null, 'failed', 'no address found'))
            }

            return res.status(200).json(responseJSON(address))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', 'failed to fetch data from database'))

        }
    }

    static createNewAddress = async (req, res) => {
        try {

            const { address, receiver, phone, note } = req.body

            const payload = {
                userId: req.user.id,
                address: address,
                receiver: receiver,
                phone: phone,
                note: note
            }

            const addresses = await Address.findAll({
                where: {
                    [Op.and]: [{ userId: req.user.id }, { isMain: true }]

                }
            })

            if (addresses.length === 0) {
                payload.isMain = true
            }

            const addressCreated = await Address.create(payload)

            return res.status(201).json(responseJSON(addressCreated))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'failed when create new address'))

        }
    }

    static updateAddress = async (req, res) => {

        try {

            const id = req.params.id

            const { address, note, receiver, phone} = req.body

            const addressUpdate = await Address.findOne({
                where: {
                    [Op.and]: [{ userId: req.user.id }, { id: id }]
                }
            })

            if (!addressUpdate) {
                return res.status(404).json(responseJSON(null, 'failed', 'no address found'))
            }

            const payload = {
                address: address ?? addressUpdate.dataValues.address,
                note: note ?? addressUpdate.dataValues.note,
                receiver: receiver ?? addressUpdate.dataValues.receiver,
                phone: phone ?? addressUpdate.dataValues.phone
            }

            await addressUpdate.update(payload)

            return res.status(200).json(responseJSON(addressUpdate))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while update address'))

        }

    }

    static updateMainAddress = async (req, res) => {

        const t = await sequelize.transaction()

        try {

            const id = req.params.id

            let address = await Address.update({
                isMain: false
            }, {
                where: {
                    [Op.and]: [{ userId: req.user.id }, { isMain: true }]
                },
                transaction: t

            })

            address = await Address.update({
                isMain: true
            }, {
                where: {
                    [Op.and]: [{ userId: req.user.id }, { id: id }]
                },
                transaction: t
            })

            if (address[0] === 0) {
                return res.status(400).json(responseJSON(null, 'failed', 'no address set to main'))
            }

            await t.commit()

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            await t.rollback()

            return res.status(400).json(responseJSON(null, 'failed', `error while set new main address`))


        }

    }

    static deleteAddress = async (req, res) => {

        try {

            const address = await Address.destroy({
                where: {
                    [Op.and]: [{ userId: req.user.id }, { id: req.params.id }, { isMain: false }]
                }
            })

            if (address === 0) {
                return res.status(404).json(responseJSON(null, 'failed', 'no address deleted'))
            }

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error))

        }

    }
}

module.exports = { AddressController }