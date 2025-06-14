const
    { Image, User } = require('../models'),
    { Op } = require('sequelize'),
    { dataPicker } = require('../helpers/response.js'),
    DataManipulationService = require('./dataManipulationService.js'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    { CustomError } = require('../errors/customError.js')

class UserService {

    static register = async (req) => {

        try {

            if (req.body.rePassword != req.body.password) {
                throw new CustomError('Password Confirmation Error', 400, {
                    password: 'password and rePassword did not match'
                })
            }

            const userPayload = {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                isAdmin: req.body.isAdmin
            }

            const newUser = await DataManipulationService.create({
                model: User,
                payload: userPayload,
            })

            const userResponse = dataPicker(newUser, ['name', 'username', 'email', 'phone', 'isAdmin'])

            return userResponse

        } catch (error) {

            throw error

        }

    }

    static getUser = async (req) => {

        try {

            const userAttributes = ['name', 'username']

            const id = req.user.id

            const user = await DataManipulationService.findById(
                User,
                id,
                {
                    attributes: userAttributes,
                    include: {
                        model: Image,
                        as: 'image',
                        attributes: ['url']
                    },
                }
            )

            return user

        } catch (error) {

            return error

        }
    }

    static login = async (payload) => {

        try {

            payload.userLogin = payload.userLogin.toLowerCase()

            let user = await User.findOne({
                where: {
                    [Op.or]: [{ username: payload.userLogin }, { email: payload.userLogin }, { phone: payload.userLogin }]
                }
            })

            if (!user) throw new CustomError('Login failed', 404, 'User not found')

            const passwordCompared = bcrypt.compareSync(payload.password, user.dataValues.password)

            if (!passwordCompared) throw new CustomError('Login failed', 404, 'User not found')

            if (!user.isActive) throw new CustomError('Login failed', 400, 'User is not verified')

            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin,
                isActive: user.dataValues.isActive
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            return accessToken

        } catch (error) {

            throw error

        }

    }

    static verifyUser = async (id) => {

        try {

            const user = await DataManipulationService.findById(
                User,
                id,
                {
                    attributes: ['id', 'isActive']
                }
            )

            if (!user) {
                throw new CustomError('User verify failed', 404, `No user found with id ${id}`)
            }

            if (user.isActive) {
                throw new CustomError('User verify failed', 400, `User with id ${id} is already active`)
            }

            const updatedUserCount = await DataManipulationService.update({
                model: User,
                payload: {
                    isActive: true
                },
                id: id
            })

            if (updatedUserCount === 0) {
                throw new CustomError('User verify failed', 500, `Failed to update user with id ${id}`)
            }

            return updatedUserCount

        } catch (error) {

            throw error

        }

    }

    static editUser = async (req) => {

        try {

            let { name, username, email, phone, address, password } = req.body

            if (req.body.password || req.body.rePassword) {
                if (!req.body.password || !req.body.rePassword) {
                    throw new CustomError('Password Confirmation Error', 400, {
                        password: 'Both password and rePassword must be provided',
                    });
                }
                if (req.body.password !== req.body.rePassword) {
                    throw new CustomError('Password Confirmation Error', 400, {
                        password: 'Password and rePassword did not match',
                    });
                }
            }

            const id = req.user.id

            const user = await DataManipulationService.findById(User, id)

            if (!user) throw new CustomError('Update data failed', 404, 'No user match with id')

            const payload = {
                name: name ?? user.dataValues.name,
                username: username ?? user.dataValues.username,
                email: email ?? user.dataValues.email,
                phone: phone ?? user.dataValues.phone,
                address: address ?? user.dataValues.address,
                password: password ?? user.dataValues.password
            }

            const userUpdate = await DataManipulationService.update({
                model: User,
                payload: payload,
                id: id,
            })

            if (userUpdate === 0) {
                throw new CustomError('Update data failed', 400, 'No data updated')
            }

        } catch (error) {

            throw error

        }

    }

    static deleteUser = async (req) => {

        try {

            const userDeleted = await DataManipulationService.delete({
                model: User,
                id: req.user.id
            })

            if (userDeleted === 0) {
                throw new CustomError('Delete user failed', 400, 'No user deleted')
            }

            console.log("After Deletion");
            

        } catch (error) {

            throw error

        }

    }

}

module.exports = { UserService }