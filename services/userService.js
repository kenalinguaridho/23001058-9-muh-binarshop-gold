const
    { Image, User, sequelize } = require('../models'),
    { Op } = require('sequelize'),
    { unlink } = require('../helpers/unlinkMedia.js'),
    { dataPicker } = require('../helpers/response.js'),
    { DataManipulationService } = require('./dataManipulationService.js'),
    Cloudinary = require('../lib/cloudinary'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    { CustomError } = require('../errors/customError.js')

class UserService {

    static register = async (req) => {

        const t = await sequelize.transaction()

        let imageResult = {}

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

            const newUser = await DataManipulationService.create(User, userPayload, { transaction: t })

            if (req.file) {

                imageResult = await Cloudinary.upload(req.file.path)

                unlink(req.file)

                const imagePayload = {
                    usage: 'avatar',
                    parentId: newUser.dataValues.id,
                    url: imageResult.secure_url,
                    publicId: imageResult.public_id
                }

                await DataManipulationService.create(Image, imagePayload, { transaction: t })

            }

            await t.commit()

            const userResponse = dataPicker(newUser, ['name', 'username', 'email', 'phone', 'isAdmin'])

            return userResponse

        } catch (error) {

            await t.rollback()

            if (imageResult) {
                await Cloudinary.rollback(imageResult.public_id)
            }

            throw error

        }

    }

    static getUser = async (identifier) => {

        try {

            const user = await DataManipulationService.findById(User, identifier, {
                attributes: ['name', 'username'],
                include: {
                    model: Image,
                    as: 'image',
                    attributes: ['url']
                },
            })

            return user

        } catch (error) {
            throw error
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

            if (!user) throw error

            if (!user.isActive) throw error

            const passwordCompared = bcrypt.compareSync(payload.password, user.dataValues.password)

            if (!passwordCompared) throw error

            const data = {
                id: user.dataValues.id,
                username: user.dataValues.username,
                isAdmin: user.dataValues.isAdmin,
                isActive: user.dataValues.isActive
            }

            let accessToken = jwt.sign(data, process.env.SECRET_KEY)

            return accessToken

        } catch (error) {
            throw new CustomError('user not found', 404, error)
        }

    }

}

module.exports = { UserService }