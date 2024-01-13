const
    { responseJSON } = require('../helpers/response.js'),
    { spaceChecker } = require("../helpers/spaceCheck.js"),
    users = require('../database/users.json'),
    dbPath ='./database/users.json',
    bcrypt = require('bcryptjs'),
    fs = require("fs")

class UserController {

    static register = (req, res) => {
        let { name, username, email, phone, password, rePassword } = req.body

        if (rePassword != password) {
            res.status(403).json(`Password yang anda masukkan tidak sesuai`)
        }

        if (!spaceChecker(username)) {
            return res.status(403).json("username tidak boleh menggunakan spasi")
        }

        if (!spaceChecker(password)) {
            return res.status(403).json("password tidak boleh menggunakan spasi")
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                return res.status(403).json(`Username sudah digunakan`)
            }
            if (users[i].email === email) {
                return res.status(403).json(`Email sudah digunakan`)
            }
            if (users[i].phone === phone) {
                return res.status(403).json(`Nomor telepon sudah digunakan`)
            }
        }

        let id = users.length + 1

        if (users.length !== 0) {
            id = users[users.length - 1].id + 1
        }

        const hashPassword = bcrypt.hashSync(password, 10)
        username = username.toLowerCase()
        email = email.toLowerCase()

        let result = {
            data: {
                id: id,
                name: name,
                username: username,
                email: email,
                phone: phone,
                password: hashPassword
            },
            message: 'Registrasi berhasil!'
        }

        users.push(result.data)
        fs.writeFileSync(dbPath, JSON.stringify(users), 'utf-8')
        res.status(201).json(responseJSON(result.data, result.message))

    }

    static login = (req, res) => {
        let { username, password } = req.body
        let isUsernameFound = false

        username = username.toLowerCase()

        let result = {
            data: {
                username: username,
                password: password
            },
            message: `Login berhasil!`
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                result.data.username = users[i].username
                isUsernameFound = true
                break
            }
        }

        if (!isUsernameFound) {
            result.message = 'Username yang anda masukkan tidak terdaftar'
            res.status(404).json(responseJSON(result.data, result.message))
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                if (bcrypt.compareSync(password, users[i].password) == true) {
                    res.status(200).json(responseJSON(result.data))
                } else {
                    result.message = 'Password yang anda masukkan salah!'
                    res.status(401).json(responseJSON(result.data, result.message))
                }
            }
        }
    }

    static getUser = (_, res) => {
        res.status(200).json(users)
    }

}

module.exports = { UserController }