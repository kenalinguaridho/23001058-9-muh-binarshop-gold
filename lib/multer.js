const multer = require('multer')

const fileFormat = (fileName) => {
    let name = ''
    for (let i = 0; i < fileName.length; i++) {

        if (fileName[i] === '.') {
            break
        }
        name += fileName[i]

    }

    return fileName.substring(name.length)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const format = fileFormat(file.originalname)
        cb(null, `${file.fieldname}-${uniqueSuffix}${format}`)
    }
})

const upload = multer({ storage: storage })


module.exports = upload