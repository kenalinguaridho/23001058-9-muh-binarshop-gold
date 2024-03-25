const
    { responseJSON } = require('../helpers/response.js'),
    { User } = require('../models'),
    { Op } = require("sequelize"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    { mailer } = require('../lib/mailer.js');

require('dotenv').config()

class UserController {

    static register = async (req, res) => {

        let { name, username, email, phone, password, rePassword } = req.body

        let statusCode = 201

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
        }

        try {
            const data = {
                name: name ?? '',
                username: username ?? '',
                email: email ?? '',
                phone: phone ?? '',
                password: password ?? ''
            }

            let user = await User.create(data)

            mailer(user)

            return res.status(statusCode).json(responseJSON(user.dataValues))


        } catch (error) {

            let statusCode = 400

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message))

        }

    }

    static registerAdmin = async (req, res) => {

        let { name, username, email, phone, password, rePassword } = req.body

        let statusCode = 201

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
        }

        try {
            const data = {
                name: name ?? '',
                username: username ?? '',
                email: email ?? '',
                phone: phone ?? '',
                isAdmin: true,
                password: password ?? ''
            }

            const user = await User.create(data)

            mailer(user)

            return res.status(statusCode).json(responseJSON(user.dataValues))


        } catch (error) {

            let statusCode = 400

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            }

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? error.message))

        }

    }

    static login = async (req, res) => {
        let { userLogin, password } = req.body

        userLogin = userLogin.toLowerCase()

        try {

            let user = await User.findOne({
                where: {
                    [Op.or]: [{ username: userLogin }, { email: userLogin }]
                }
            })

            if (!user) {
                return res.status(404).json(responseJSON(null, 'failed', 'user not found'))
            }

            const passwordCompared = bcrypt.compareSync(password, user.dataValues.password)

            if (!passwordCompared) {
                return res.status(404).json(responseJSON(null, 'failed', 'user not found'))
            }

            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            data.accessToken = accessToken

            return res.status(statusCode).json(responseJSON(data))

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

            let user = await User.findByPk(id)

            const data = {
                name: name ? name : user.dataValues.name,
                username: username ? username : user.dataValues.username,
                email: email ? email : user.dataValues.email,
                phone: phone ? phone : user.dataValues.phone,
                address: address ? address : user.dataValues.address,
                password: password ? password : user.dataValues.password
            }

            await User.update(data, {
                where: {
                    id: id
                },
                individualHooks: true
            })

            return res.status(200).json(responseJSON(data))

        } catch (error) {

            return res.status(400).json(responseJSON(null, 'failed', error.errors[0].message ?? 'no rows affected'))

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
                return res.status(400).json(responseJSON(null, 'failed', `no user deleted`))
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

            if (!user) {
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