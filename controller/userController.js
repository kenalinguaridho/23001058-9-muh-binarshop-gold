const
    { responseJSON } = require('../helpers/response.js'),
    { spaceChecker } = require("../helpers/spaceCheck.js"),
    { User } = require('../models'),
    { Op } = require("sequelize"),
    bcrypt = require('bcryptjs')

class UserController {

    static register = async (req, res) => {
        let { name, username, email, phone, address, password, rePassword } = req.body

        if (name == undefined) {
            name = ""
        }
        if (username == undefined) {
            username = ""
        }
        if (email == undefined) {
            email = ""
        }
        if (phone == undefined) {
            phone = ""
        }
        if (address == undefined) {
            address = ""
        }
        if (password == undefined) {
            password = ""
        }
        username = username.toLowerCase()
        email = email.toLowerCase()

        let statusCode = 201
        let status = 'success'
        let data = {}
        let messages = {}


        if (name === "") {
            messages.name = 'name cannot be empty'
        }
        if (username === "") {
            messages.username = 'username cannot be empty'
        }
        if (email === "") {
            messages.email = 'email cannot be empty'
        }
        if (phone === "") {
            messages.phone = 'phone number cannot be empty'
        }
        if (address === "") {
            messages.address = 'address cannot be empty'
        }
        if (password === "") {
            messages.password = 'password cannot be empty'
        }

        if (Object.keys(messages).length != 0) {
            status = 'failed'
            return res.status(400).json(responseJSON(null, status, messages))
        }

        if (rePassword != password) {
            status = 'failed'
            return res.status(400).json(responseJSON(null, status, 'password is not consistent'))
        }

        if (!spaceChecker(username)) messages.username = 'username cannot contain spaces'
        if (!spaceChecker(password)) messages.password = 'password cannot contain spaces'
        if (!spaceChecker(email)) messages.email = 'email cannot contain spaces'

        if (Object.keys(messages).length != 0) {

            statusCode = 400
            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, messages))

        }

        try {
            let [usernameDuplicate, emailDuplicate, phoneDuplicate] = await Promise.allSettled([

                User.findOne({
                    where: {
                        username: username
                    }
                }),
                User.findOne({
                    where: {
                        email: email
                    }
                }),
                User.findOne({
                    where: {
                        phone: phone
                    }
                })

            ])

            if (usernameDuplicate.value != null) {
                messages.username = 'Username is already used'
            }
            if (emailDuplicate.value != null) {
                messages.email = 'Email is already used'
            }
            if (phoneDuplicate.value != null) {
                messages.phone = 'Phone Number is already used'
            }

            if (Object.keys(messages).length != 0) {
                throw error
            }

            const hashPassword = bcrypt.hashSync(password, 10)

            data = {
                name: name,
                username: username,
                email: email,
                phone: phone,
                address: address,
                password: hashPassword
            }

            await User.create(data)

        } catch (error) {
            status = 'failed'
            statusCode = 409
            data = null
        }

        return res.status(statusCode).json(responseJSON(data, status, messages))

    }

    static login = async (req, res) => {
        let { username, password } = req.body

        let statusCode = 200
        let status = 'success'
        let message

        username = username.toLowerCase()

        let data = {
            username: username,
            password: password
        }

        try {

            let user = await User.findOne({
                where: {
                    username: username
                }
            })

            if (user == null) {

            }

            if (bcrypt.compareSync(password, user.dataValues.password) !== true) {
                status = 'failed'
                message = `password incorrect`
                statusCode = 401
            }

        } catch (error) {

            status = 'failed'
            message = `Username ${username} not found`
            statusCode = 404

        }
        return res.status(statusCode).json(responseJSON(data, status, message))

    }

    static getUser = async (_, res) => {
        let users
        let status = 'success'
        let statusCode = 200
        let message

        try {
            users = await User.findAll({})
        } catch (error) {
            status = 'failed'
            statusCode = 404
            message = 'No user found'
        }

        return res.status(statusCode).json(responseJSON(users, status, message))
    }

    static editUser = async (req, res) => {

        let { name, username, email, phone, address, password, rePassword } = req.body
        let id = +req.params.id

        if (username == undefined) {
            username = ""
        }
        if (email == undefined) {
            email = ""
        }
        if (phone == undefined) {
            phone = ""
        }

        let statusCode = 200
        let status = 'success'
        let data = {}
        let messages = {}

        if (rePassword != password) {
            return res.status(400).json(responseJSON(null, status, 'password is not consistent'))
        }

        if (!spaceChecker(username)) messages.username = 'username cannot contain spaces'
        if (!spaceChecker(password)) messages.password = 'password cannot contain spaces'
        if (!spaceChecker(email)) messages.email = 'email cannot contain spaces'

        if (Object.keys(messages).length != 0) {
            statusCode = 400
            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, messages))
        }

        try {

            let user = await User.findOne({
                where: {
                    id: id
                }
            })

            if (!user) {
                statusCode = 404
                messages = `user with id ${id} not found`
                throw error
            }

            let [usernameDuplicate, emailDuplicate, phoneDuplicate] = await Promise.allSettled([
                User.findOne({
                    where: {
                        username: username,
                        id: {
                            [Op.ne]: id
                        }
                    }
                }),
                User.findOne({
                    where: {
                        email: email,
                        id: {
                            [Op.ne]: +req.params.id
                        }
                    }
                }),
                User.findOne({
                    where: {
                        phone: phone,
                        id: {
                            [Op.ne]: +req.params.id
                        }
                    }
                })
            ])

            if (usernameDuplicate.value != null) {
                messages.username = 'Username is already used'
            }
            if (emailDuplicate.value != null) {
                messages.email = 'Email is already used'
            }
            if (phoneDuplicate.value != null) {
                messages.phone = 'Phone Number is already used'
            }

            if (Object.keys(messages).length != 0) {
                statusCode = 409
                throw error
            }

            const hashPassword = bcrypt.hashSync(password, 10)

            username = username.toLowerCase()
            email = email.toLowerCase()

            data = {
                name: name ? name : user.dataValues.name,
                username: username ? username : user.dataValues.username,
                email: email ? email : user.dataValues.email,
                phone: phone ? phone : user.dataValues.phone,
                address: address ? address : user.dataValues.address,
                password: hashPassword ? password : user.dataValues.password
            }

            await User.update(data, {
                where: {
                    id: id
                }
            })

        } catch (error) {

            status = 'failed'
            return res.status(statusCode).json(responseJSON(null, status, messages))

        }

        return res.status(statusCode).json(responseJSON(null, status))
    }

    static deleteUser = async (req, res) => {

        let id = +req.params.id

        try {

            let user = await User.destroy({
                where: {
                    id: id
                }
            })

            if (!user) throw error

        } catch (error) {

            return res.status(404).json(responseJSON(null, 'failed', `user with id ${id} not found`))

        }

        return res.status(200).json(responseJSON(null, 'success'))
    }

}

module.exports = { UserController }