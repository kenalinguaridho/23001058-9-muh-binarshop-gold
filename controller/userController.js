const { CustomError } = require('../errors/customError.js');
const
    { responseJSON } = require('../helpers/response.js'),
    { User, Image, sequelize } = require('../models'),
    { Op } = require("sequelize"),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    { unlink } = require('../helpers/unlinkMedia.js'),
    Cloudinary = require('../lib/cloudinary.js'),
    { UserService } = require('../services/userService.js');

require('dotenv').config()

class UserController {

    static registerUser = async (req, res, next) => {
        
        try {

            const newUser = await UserService.register(req)

            return res.status(201).json(responseJSON(newUser))


        } catch (error) {

            next(error)

        }

    }

    static registerAdmin = async (req, res, next) => {
        
        try {

            req.body.isAdmin = true

            const newUser = await UserService.register(req)

            return res.status(201).json(responseJSON(newUser))


        } catch (error) {

            next(error)

        }

    }

    static login = async (req, res) => {

        try {

            let { userLogin, password } = req.body

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

            console.log("User ==> ", user.dataValues);

            if (!user) {
                throw new CustomError('user not found')
            }

            if (!user.isActive) {
                throw new CustomError('user not found')
            }

            const passwordCompared = bcrypt.compareSync(payload.password, user.dataValues.password)

            console.log("password compared ==> ", passwordCompared);

            if (!passwordCompared) {
                throw new CustomError('user not found')
            }

            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin,
                isActive: user.dataValues.isActive
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            console.log("Access Token ==> ", accessToken);

            data.accessToken = accessToken

            return res.status(200).json(responseJSON(data))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', error.message))

        }

    }

    static getUser = async (req, res, next) => {

        try {

            const user = await UserService.getUser(req.user.id)

            return res.status(200).json(responseJSON(user))

        } catch (error) {

            next(error)

        }


    }

    static editUser = async (req, res) => {

        const t = await sequelize.transaction()

        try {

            let { name, username, email, phone, address, password, rePassword } = req.body

            let id = req.user.id

            if (rePassword != password) {
                return res.status(400).json(responseJSON(null, 'failed', 'password is not consistent'))
            }

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
                individualHooks: true,
                transaction: t
            })

            await t.commit()

            return res.status(200).json(responseJSON(user))

        } catch (error) {

            let statusCode = 500

            if (req.file) {
                unlink(req.file)
            }

            if (error.name === 'SequelizeValidationError') {
                statusCode = 400
            }
            await t.rollback()

            return res.status(statusCode).json(responseJSON(null, 'failed', error.errors[0].message ?? 'error while updating data'))

        }

    }

    static deleteUser = async (req, res) => {

        try {

            let id = req.user.id

            const userDeleted = await User.destroy({
                where: {
                    id: id
                }
            })

            if (userDeleted = 0) {
                throw error
            }

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            return res.status(500).json(responseJSON(null, 'failed', `failed while deleting account`))

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

    static uploadAvatar = async (req, res) => {

        const t = await sequelize.transaction()

        let imageResult

        try {

            // return error if no image is uploaded
            if (!req.file) {
                return res.status(400).json(responseJSON(null, 'failed', 'no image is uploaded'))
            }

            // Find if any image related
            const image = await Image.findOne({
                where: {
                    parentId: req.user.id
                }
            })

            let currentPublicId

            // Upload new user avatar image
            imageResult = await Cloudinary.upload(req.file.path)

            if (image) {

                // If image related is found
                // Assign current publicId before update with new publicId
                currentPublicId = image.dataValues.publicId
                // await Cloudinary.rollback(image.dataValues.publicId)

                // Update image data in database
                await image.update({
                    url: imageResult.secure_url,
                    publicId: imageResult.public_id
                }, {
                    transaction: t
                })
                
                // Delete old image from cloudinary
                Cloudinary.rollback(currentPublicId)

            } else {

                // If image related is not found create new image row
                const imagePayload = {
                    usage: 'avatar',
                    parentId: req.user.id,
                    url: imageResult.secure_url,
                    publicId: imageResult.public_id
                }    

                await Image.create(imagePayload, { transaction: t })

            }    

            // Clear uploads folder
            unlink(req.file)

            // commit all change
            await t.commit()

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            // Clear uploads folder
            unlink(req.file)

            // Delete new user avatar from cloudinary
            if (imageResult) {
                Cloudinary.rollback(imageResult.public_id)
            }

            return res.status(500).json(responseJSON(null, 'failed', 'error while upload avatar'))

        }
    }

    static deleteAvatar = async (req, res) => {

        const t = await sequelize.transaction()

        try {

            const image = await Image.findOne({
                where: {
                    parentId: req.user.id
                }
            })

            await Cloudinary.rollback(image.dataValues.publicId)

            await image.destroy()

            await t.commit()

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            await t.rollback()

            return res.status(500).json(responseJSON(null, 'failed', 'error while delete image'))
        }
    }

}

module.exports = { UserController }