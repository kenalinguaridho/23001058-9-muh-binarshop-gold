const
    { responseJSON } = require('../helpers/response.js'),
    { OrderProduct, Order, User, Product } = require('../models')

class OrderProductController {
    static getAllOrderProducts = async (req, res) => {
        try {

            const orderProducts = await OrderProduct.findAll({
                attributes: ['id', 'amount', 'subTotal'],
                include: [
                    {
                        model: Order,
                        as: 'order',
                        attributes: ['id', 'userId', 'status'],
                        include: {
                            model: User,
                            as: 'user',
                            attributes: ['name']
                        }

                    },
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'price']
                    }
                ]
            })

            return res.status(200).json(responseJSON(orderProducts))

            // const orderProducts = await sequelize.query(`select op.id, op."orderId", o.status, o."userId", o."userName", op."productId", p.name as "productName", op.amount as qty, op."subTotal"/op.amount as "pricePerUnit", op."subTotal" from "OrderProducts" op left join (select o.id, o.status, u.name as "userName", o."userId" from "Orders" o left join (select id, name from "Users") u	on "userId" = u.id) o on o.id = op."orderId" left join (select id, name from "Products") p on op."productId" = p.id`)

            // return res.status(200).json(responseJSON(orderProducts[0]))
        } catch (error) {
            return res.status(500).json("not ok")
        }
    }
}

module.exports = { OrderProductController }