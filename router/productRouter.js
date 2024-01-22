const
    express = require('express'),
    productRouter = express.Router(),
    { ProductController } = require('../controller/productController.js');

productRouter
    .get('/', ProductController.getAllProducts)
    .post('/', ProductController.createNewProduct)

productRouter
    .get('/:id', ProductController.getProductById)
    .put('/:id', ProductController.editProduct)
    .delete('/:id', ProductController.deleteProduct)

module.exports = productRouter