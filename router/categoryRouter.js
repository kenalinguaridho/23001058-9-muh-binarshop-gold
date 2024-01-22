const
    express = require('express'),
    categoryRouter = express.Router(),
    { CategoryController } = require('../controller/categoryController');

categoryRouter
    .get('/', CategoryController.getAllCategories)
    .get('/:id', CategoryController.getCategoryById)
    .post('/', CategoryController.createNewCategory)
    .put('/:id', CategoryController.updateCategory)
    .delete('/:id', CategoryController.deleteCategory)

module.exports = categoryRouter 