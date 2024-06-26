const
    Auth = require('../lib/auth.js'),
    passport = require('../lib/passport'),
    express = require('express'),
    productRouter = express.Router(),
    upload = require('../lib/multer.js'),
    { ProductController } = require('../controller/productController.js');

productRouter
    .get('/', ProductController.getAllProducts)
    .get('/:id', ProductController.getProductById)

productRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeAdmin)
productRouter
    .post('/',upload.array('products', 8), ProductController.createNewProduct)
    .put('/:id',upload.array('products', 8), ProductController.editProduct)
    .delete('/:id', ProductController.deleteProduct)
    .patch('/:id', ProductController.restock)

module.exports = productRouter