const
    express = require('express'),
    userRouter = express.Router(),
    { UserController } = require('../controller/userController.js');

userRouter
    .get('/', UserController.getUser)
    .post('/register', UserController.register)
    .post('/login', UserController.login)
    .delete('/:id', UserController.deleteUser)
    .put('/:id', UserController.editUser)

module.exports = userRouter