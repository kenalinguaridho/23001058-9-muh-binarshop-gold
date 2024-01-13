const
    express = require('express'),
    itemRouter = express.Router(),
    { ItemController } = require('../controller/itemController.js');

itemRouter
    .get('/', ItemController.getAllItems)
    .post('/', ItemController.createNewItem)

itemRouter
    .get('/:id', ItemController.getItemById)
    .put('/:id', ItemController.editItem)
    .delete('/:id', ItemController.deleteItem)

module.exports = itemRouter