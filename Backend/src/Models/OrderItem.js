module.exports = (sequelize, DataTypes) => {
 const OrderItem = sequelize.define(
    "OrderItem", 
    {
    id : {
        type : DataTypes.INTEGER, 
        primaryKey : true, 
        allowNull : false, 
        autoIncrement : true
    },
    quantity : {
        type : DataTypes.INTEGER, 
        allowNull : false
    },
    product_price : {
        type : DataTypes.DECIMAL(12, 2), 
        allowNull : false
    },
    total_price : {
        type : DataTypes.DECIMAL(12, 2), 
        allowNull : false
    },
    order_id : {
        type : DataTypes.INTEGER, 
        allowNull : false,
        primarykey : true,
        references: {model: "orders", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    product_id : {
        type : DataTypes.INTEGER, 
        allowNull : false,
        primarykey :true,
        references: {model: "products", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    }
    }, {
        tableName : "order_items",
        timestamps : true
    });

    OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Product, { foreignKey: "product_id" })
    OrderItem.belongsTo(models.Order, {foreignKey : "order_id"})
    models.Product.hasMany(OrderItem, { foreignKey: "product_id" })
  }

  return OrderItem
}