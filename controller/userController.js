const
    { responseJSON } = require('../helpers/response.js'),
    { User, Image, sequelize } = require('../models'),
    { unlink } = require('../helpers/unlinkMedia.js'),
    Cloudinary = require('../lib/cloudinary.js'),
    { UserService } = require('../services/userService.js')

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

    static login = async (req, res, next) => {

        try {

            let { userLogin, password } = req.body

            const payload = {
                userLogin: userLogin ?? '',
                password: password ?? ''
            }

            const accessToken = await UserService.login(payload)

            const data = {}

            data.authToken = accessToken

            return res.status(200).json(responseJSON(data))

        } catch (error) {

            next(error)

        }

    }

    static getUser = async (req, res, next) => {

        try {

            const user = await UserService.getUser(req)

            return res.status(200).json(responseJSON(user))

        } catch (error) {

            next(error)

        }

    }

    static editUser = async (req, res, next) => {

        try {

            await UserService.editUser(req)

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            next(error)

        }

    }

    static deleteUser = async (req, res, next) => {

        try {

            await UserService.deleteUser(req)

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            next(error)

        }

    }

    static verifyUser = async (req, res, next) => {

        try {

            const id = req.params.id

            await UserService.verifyUser(id)

            return res.status(200).json(responseJSON(null))

        } catch (error) {

            next(error)

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