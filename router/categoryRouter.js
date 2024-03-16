const
    express = require('express'),
    categoryRouter = express.Router(),
    passport = require('../lib/passport'),
    Auth = require('../lib/auth'),
    { CategoryController } = require('../controller/categoryController')

categoryRouter
    .get('/', CategoryController.getAllCategories)
    .get('/:id', CategoryController.getCategoryById)

categoryRouter.use(passport.initialize(), Auth.authentication, Auth.authorizeAdmin)
categoryRouter
    .post('/', CategoryController.createNewCategory)
    .put('/:id', CategoryController.updateCategory)
    .delete('/:id', CategoryController.deleteCategory)

module.exports = categoryRouter 