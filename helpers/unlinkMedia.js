const 
    fs = require("fs"),
    { CustomError } = require("../errors/customError")

const unlink = (files) => {
    if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
            fs.unlink(files[i].path, (err) => {
                if (err) {
                    throw new CustomError()
                }
            })
        }
    } else {
        fs.unlink(files.path, err => {
            if (err) {
                throw new CustomError()
            }
        })
    }
}

module.exports = { unlink }