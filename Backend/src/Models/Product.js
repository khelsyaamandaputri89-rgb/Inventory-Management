module.exports = (sequelize, DataTypes) => {
const Product = sequelize.define(
    "Product", 
    {
    id : {
        type : DataTypes.INTEGER, 
        primaryKey : true, 
        allowNull : false, 
        autoIncrement : true
    },
    name : {
        type : DataTypes.STRING, 
        allowNull : false
    },
    price : {
        type : DataTypes.DECIMAL(12, 2), 
        allowNull : false
    },
    stock : {
        type : DataTypes.INTEGER, 
        defaultValue : 0
    },
    user_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {model: "users", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    category_id: {
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {model: "categories", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
   }, {
        tableName : "products",
        timestamps : true
    })

    Product.associate = (models) => {
        Product.hasMany(models.OrderItem, {foreignKey : "product_id"})
        models.OrderItem.belongsTo(Product, {foreignKey : "product_id"})
 
        Product.hasMany(models.Stock, {foreignKey : "product_id"})
        models.Stock.belongsTo(Product, {foreignKey : "product_id"})
    }

    return Product
}