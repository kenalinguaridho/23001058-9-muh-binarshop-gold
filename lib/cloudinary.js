const cloudinary = require('cloudinary').v2
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CL_CLOUD_NAME,
    api_key: process.env.CL_API_KEY,
    api_secret: process.env.CL_API_SECRET,
})

class Cloudinary {
    static upload = async (filePath) => {
    
        try {
            const result = cloudinary.uploader.upload(filePath, {
                use_filename: true
            })
    
            return result
        } catch (error) {
            throw error
        }
    
    }

    static rollback = async (publicId) => {

        try {
            const result = cloudinary.api.delete_resources(publicId)

            return result
        } catch (error) {
            throw error
        }

    }

}



module.exports = Cloudinary