const
    Auth = require('../lib/auth.js'),
    passport = require('../lib/passport'),
    express = require('express'),
    productRouter = express.Router(),
    { ProductController } = require('../controller/productController.js');

productRouter
    .get('/', ProductController.getAllProducts)
    .get('/:id', ProductController.getProductById)

productRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeAdmin)
productRouter
    .post('/', ProductController.createNewProduct)
    .put('/:id', ProductController.editProduct)
    .delete('/:id', ProductController.deleteProduct)

module.exports = productRouter