const {Op, where} = require("sequelize")
const {Product, Order, User, Categories, OrderItem} = require("../Models")

const searchAll = async (req, res) => {
    const {query} = req.query
    const role = req.user.role
    const userId = req.user.userId

    if (!query) return res.status(400).json({message : "Query is required"})

    try {
        let result = {}

        const products = await Product.findAll({
            where : {name : {[Op.like] : `%${query}%`}},
            limit : 5
        })
        result.products = products

        if (role === "admin" || role === "superadmin") {
            const categories = await Categories.findAll({
                where : {name : {[Op.like] : `%${query}%`}},
                limit : 5
            })
            result.categories = categories
        }

        const orders = await Order.findAll({
            where : 
                role === "user" ? {user_id : userId} : {},
            include : [
                {
                    model : User,
                    attributes : ["username"]
                },
                {
                    model : OrderItem,
                    required : false,
                    include : [
                        {
                            model : Product,
                            attributes : ["name"]
                        }
                    ]
                }
            ],
            limit : 5
        })
        result.orders = orders.filter((o) => {
            const usernameMatch = o.User?.username
                ?.toLowerCase()
                .includes(query.toLowerCase());
            const productMatch = o.OrderItems?.some((i) =>
                i.Product?.name?.toLowerCase().includes(query.toLowerCase())
            )
                return usernameMatch || productMatch || o.id.toString().includes(query);
            }
        )


        if (role === "superadmin") {
            const users = await User.findAll({
                where : {
                    username : {[Op.like] : `%${query}%`}
                },
                limit :5
            })
            result.users = users
        }
        
        res.json({result})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

module.exports = {searchAll}