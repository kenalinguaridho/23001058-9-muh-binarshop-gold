const
    { responseJSON } = require('../helpers/response.js'),
    { User } = require('../models'),
    { Op } = require("sequelize"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    { unlink } = require('../helpers/unlinkMedia.js'),
    { mailer } = require('../lib/mailer.js');

require('dotenv').config()

class UserController {

    static registerUser = async (req, res) => {

        try {

            let { name, username, email, phone, password, rePassword } = req.body

            if (rePassword != password) {
                return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
            }


            const data = {
                name: name,
                username: username,
                email: email,
                phone: phone,
                password: password
            }

            let user = await User.create(data)

            mailer(user)

            return res.status(201).json(responseJSON(user.dataValues))


        } catch (error) {

            unlink(req.file)

            let statusCode = 500

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            } else if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while creating new user'))

        }

    }

    static registerAdmin = async (req, res) => {

        try {

            let { name, username, email, phone, password, rePassword } = req.body

            if (rePassword != password) {
                return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
            }

            const data = {
                name: name,
                username: username,
                email: email,
                phone: phone,
                isAdmin: true,
                password: password
            }

            const user = await User.create(data)

            mailer(user)

            return res.status(201).json(responseJSON(user.dataValues))


        } catch (error) {

            unlink(req.file)

            let statusCode = 500

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            } else if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while creating new user'))

        }

    }

    static login = async (req, res) => {

        let { userLogin, password } = req.body

        try {

            const payload = {
                userLogin: userLogin ?? '',
                password: password ?? ''
            }

            payload.userLogin = payload.userLogin.toLowerCase()

            let user = await User.findOne({
                where: {
                    [Op.or]: [{ username: payload.userLogin }, { email: payload.userLogin }]
                }
            })

            if (!user.isActive) {
                return res.status(403).json(responseJSON(null, 'failed', 'user is inactive'))
            }

            if (!user) {
                return res.status(404).json(responseJSON(null, 'failed', 'user not found'))
            }

            const passwordCompared = bcrypt.compareSync(payload.password, user.dataValues.password)

            if (!passwordCompared) {
                return res.status(404).json(responseJSON(null, 'failed', 'user not found'))
            }

            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin,
                isActive: user.dataValues.isActive
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            data.accessToken = accessToken

            return res.status(200).json(responseJSON(data))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error.message))

        }

    }

    static getUser = async (req, res) => {

        try {

            const user = await User.findByPk(req.user.id)

            if (!user) throw error

            return res.status(200).json(responseJSON(user))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error.message))

        }


    }

    static editUser = async (req, res) => {

        let { name, username, email, phone, address, password, rePassword } = req.body

        let id = req.user.id

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
        }

        try {

            const user = await User.findByPk(id)

            const payload = {
                name: name ?? user.dataValues.name,
                username: username ?? user.dataValues.username,
                email: email ?? user.dataValues.email,
                phone: phone ?? user.dataValues.phone,
                address: address ?? user.dataValues.address,
                password: password ?? user.dataValues.password
            }

            await user.update(payload, {
                where: {
                    id
                },
                individualHooks: true
            })

            return res.status(200).json(responseJSON(user))

        } catch (error) {

            let statusCode = 500

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while updating data'))

        }

    }

    static deleteUser = async (req, res) => {

        let id = req.user.id

        try {

            const userDeleted = await User.destroy({
                where: {
                    id: id
                }
            })

            if (userDeleted = 0) {
                return res.status(400).json(responseJSON(null, 'failed', `failed while deleting account`))
            }

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error.message))

        }

    }

    static verifyUser = async (req, res) => {

        try {

            const id = req.params.id

            const user = await User.findByPk(id)

            if (!user || user.dataValues.isActive) {
                return res.status(403).json(responseJSON(null, 'failed', 'no user verified'))
            }

            await User.update({
                isActive: true
            }, {
                where: {
                    id: id
                }
            })

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error.message))

        }

    }

}

module.exports = { UserController }