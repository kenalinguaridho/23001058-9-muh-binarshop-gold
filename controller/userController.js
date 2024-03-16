const
    { responseJSON } = require('../helpers/response.js'),
    { User } = require('../models'),
    { Op } = require("sequelize"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');

require('dotenv').config()

class UserController {

    static register = async (req, res) => {
        let { name, username, email, phone, address, password, rePassword } = req.body

        let statusCode = 201

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
        }

        try {
            let data = {
                name: name ?? '',
                username: username ?? '',
                email: email ?? '',
                phone: phone ?? '',
                address: address ?? '',
                password: password ?? ''
            }

            await User.create(data)

            return res.status(statusCode).json(responseJSON(data))


        } catch (error) {

            let status = 'failed'

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            } else if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            } else {
                return res.status(500).json(responseJSON(null, status, 'Internal Server Error'))
            }

            return res.status(statusCode).json(responseJSON(null, status, error.errors[0].message))

        }

    }

    static registerAdmin = async (req, res) => {
        let { name, username, email, phone, address, password, rePassword } = req.body

        let statusCode = 201

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
        }

        try {
            let data = {
                name: name ?? '',
                username: username ?? '',
                email: email ?? '',
                phone: phone ?? '',
                address: address ?? '',
                isAdmin: true,
                password: password ?? ''
            }

            await User.create(data)

            return res.status(statusCode).json(responseJSON(data))


        } catch (error) {

            let status = 'failed'

            console.log(error)

            if (error.name === 'SequelizeUniqueConstraintError') {
                statusCode = 409
            } else if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            } else {
                return res.status(500).json(responseJSON(null, status, 'Internal Server Error'))
            }

            return res.status(statusCode).json(responseJSON(null, status, error.errors[0].message))

        }

    }

    static login = async (req, res) => {
        let { userLogin, password } = req.body

        let statusCode = 200
        let status
        let message

        userLogin = userLogin.toLowerCase()

        try {

            let user = await User.findOne({
                where: {
                    [Op.or]: [{ username: userLogin }, { email: userLogin }]
                }
            })

            if (!user) {
                message = `user not found`
                statusCode = 404
                throw error
            }

            const passwordCompared = bcrypt.compareSync(password, user.dataValues.password)
            
            if (!passwordCompared) {
                message = `password incorrect`
                statusCode = 401
                throw error
            }
            
            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            data.accessToken = accessToken
            
            return res.status(statusCode).json(responseJSON(data, status))

        } catch (error) {

            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, message))

        }

    }

    static getUser = async (req, res) => {
        
        let users
        let status = 'success'
        let statusCode = 200
        let message

        try {
            users = await User.findByPk(req.user.id)
        } catch (error) {
            status = 'failed'
            statusCode = 404
            message = 'No user found'
        }

        return res.status(statusCode).json(responseJSON(users, status, message))

    }

    static editUser = async (req, res) => {

        let { name, username, email, phone, address, password, rePassword } = req.body
        let id = req.user.id

        let statusCode = 200
        let message

        if (rePassword != password) {
            statusCode = 400
            message = 'password is not consistent'
            throw error
        }

        try {

            let user = await User.findByPk(id)

            if (!user) {
                statusCode = 404
                message = `user with id ${id} not found`
                throw error
            }

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
                individualHooks : true
            })

            return res.status(statusCode).json(responseJSON(data))

        } catch (error) {

            let status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, message || error.errors[0].message))

        }

    }

    static deleteUser = async (req, res) => {

        let id = +req.user.id

        try {

            let user = await User.destroy({
                where: {
                    id: id
                }
            })

            if (!user) throw error

            return res.status(200).json(responseJSON(null, 'success'))

        } catch (error) {

            return res.status(404).json(responseJSON(null, 'failed', `user with id ${id} not found`))

        }

    }

}

module.exports = { UserController }