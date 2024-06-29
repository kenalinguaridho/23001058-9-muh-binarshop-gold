const CryptoJS = require('crypto-js')

require('dotenv').config()

class Encryptor {
    static encrypt = (object, fields, secretKey) => {
        const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] in object) {
                object[fields[i]] = CryptoJS.AES.encrypt(object[fields[i]], CryptoJS.enc.Utf8.parse(secretKey), { iv: iv }).toString()
            }
        }

    }

    static decrypt = (object, fields, secretKey) => {

    }
}

module.exports = Encryptor