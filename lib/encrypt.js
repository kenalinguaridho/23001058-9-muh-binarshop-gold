const CryptoJS = require('crypto-js')

require('dotenv').config()

class Encryptor {
    static iv = CryptoJS.enc.Hex.parse(process.env.IV_STRING)
    static secretKey = CryptoJS.enc.Hex.parse(process.env.CRYPTO_SECRET_KEY)
    
    static encrypt = (object, fields) => {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] in object) {
                object[fields[i]] = CryptoJS.AES.encrypt(object[fields[i]], this.secretKey, { iv: this.iv }).toString()
            }
        }

        return object
    }

    static decrypt = (object, fields) => {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] in object) {
                object[fields[i]] = CryptoJS.AES.decrypt(object[fields[i]], this.secretKey, { iv: this.iv }).toString(CryptoJS.enc.Utf8)
            }
        }

        return object
    }
}

module.exports = Encryptor