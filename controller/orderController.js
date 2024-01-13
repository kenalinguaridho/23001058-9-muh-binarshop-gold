const
    { responseJSON } = require('../helpers/response.js'),
    idFinder = require('../helpers/objectFinder.js'),
    users = require('../database/users.json'),
    orders = require('../database/orders.json'),
    items = require('../database/items.json'),
    dbPath = './database/orders.json',
    fs = require('fs');

class OrderController {

    static getAllOrders = (_, res) => {
        res.status(200).json(responseJSON(orders))
    }

    static createNewOrder = (req, res) => {

        let { user_id, item_id, amount } = req.body

        let userFound = idFinder.idFinder(+user_id, users)
        if (!userFound) {
            return res.status(404).json(responseJSON(null, `User dengan id ${user_id} tidak ditemukan`))
        }

        let itemFound = idFinder.idFinder(+item_id, items)
        if (!itemFound) {
            return res.status(404).json(responseJSON(null, `Item dengan id ${item_id} tidak ditemukan`))
        }

        const item = items.find((i) => i.id === +item_id)

        const total_price = amount * item.price

        let id = orders.length + 1

        if (orders.length !== 0) {
            id = orders[orders.length - 1].id + 1
        }

        let result = {
            data: {
                id: id,
                user_id: user_id,
                item_id: item_id,
                amount: amount,
                price: item.price,
                total_price: total_price
            },
        }

        orders.push(result.data)

        fs.writeFileSync(dbPath, JSON.stringify(orders), 'utf-8')

        res.status(201).json(responseJSON(result.data))
    }

    static updateOrder = (req, res) => {
        res.status(200).json(responseJSON(_, _))
    }

}


module.exports = { OrderController }