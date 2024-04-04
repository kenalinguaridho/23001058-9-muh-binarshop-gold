const fs = require("fs")

const unlink = (files) => {
    if (files.length > 1) {
        for (let i = 0; i < files.length; i++) {
            fs.unlink(files[i].path, (err) => {
                if (err) {
                    return res.status(400).json('failed to clear uploads')
                }
            })
        }
    } else {
        fs.unlink(files.path, err => {
            if (err) {
                return res.status(400).json('failed to clear uploads')
            }
        })
    }
}

module.exports = { unlink }