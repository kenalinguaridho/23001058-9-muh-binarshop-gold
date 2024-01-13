const
    { responseJSON } = require('../helpers/response.js'),
    items = require('../database/items.json'),
    fs = require('fs'),
    dbPath = './database/items.json'

class ItemController {

    static getAllItems = (_, res) => {
        res.status(200).json(responseJSON(items, 'success'))
    }

    static getItemById = (req, res) => {

        let statusCode = 200
        let message = 'success'

        const id = req.params.id

        const item = items.find((i) => i.id === +id)

        if (item === undefined) {
            statusCode = 404
            message = `item with id ${id} not found`
        }

        return res.status(statusCode).json(responseJSON(item, message))

    }

    static createNewItem = (req, res) => {

        const { sku, name, description, price } = req.body
        
        if (objectFound) {
            return res.status(400).json(responseJSON(null, `${sku} is already used`))
        }

        let id = items.length + 1

        if (items.length != 0) {
            id = items[items.length - 1].id + 1
        }

        let result = {
            data: {
                id: id,
                sku: sku,
                name: name,
                description: description,
                price: price
            },
        }

        items.push(result.data)
        fs.writeFileSync(dbPath, JSON.stringify(items), 'utf-8')

        res.status(201).json(responseJSON(result.data, result.message))

    }

    static editItem = (req, res) => {

        const id = +req.params.id

        const item = items.find((i) => i.id === id)

        if (item === undefined) {
            return res.status(404).json(responseJSON(item, `item with id ${id} not found`))
        }

        let { sku, name, description, price } = req.body

        item.sku = sku ? sku : item.sku
        item.name = name ? name : item.name
        item.description = description ? description : item.description
        item.price = price ? price : item.price

        const otherItems = items.filter((item) => item.id !== id)

        for (let i = 0; i < otherItems.length; i++) {
            if (sku === otherItems[i].sku) {
                return res.status(409).json(`SKU ${sku} sudah digunakan`)
            }
        }

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items[i] = item
                break
            }
        }

        fs.writeFileSync('./database/items.json', JSON.stringify(items), 'utf-8')

        return res.status(201).json(responseJSON(item, 'success'))

    }

    static deleteItem = (req, res) => {

        const id = +req.params.id
        const item = items.find((i) => i.id === id)

        if (item === undefined) {
            return res.status(404).json(responseJSON(item, `item with id ${id} not found`))
        }

        let newItemsData = items.filter((item) => item.id !== id)

        fs.writeFileSync('./database/items.json', JSON.stringify(newItemsData), 'utf-8')

        res.status(200).json(responseJSON())
    }
}



module.exports = { ItemController }
