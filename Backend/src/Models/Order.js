module.exports = (sequelize, DataTypes) => {
const Order = sequelize.define(
  "Order", 
  {
    id : {
      type : DataTypes.INTEGER, 
      primaryKey : true, 
      autoIncrement : true
    },
    order_date : {
      type : DataTypes.DATE, 
      allowNull : false
    },
    user_id : {
      type : DataTypes.INTEGER, 
      allowNull : false,
      references: {model: "users", key: "id"},
      onUpdate: "CASCADE",
      onDelete: "CASCADE"
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status : {
      type : DataTypes.STRING,
      allowNull : false
    }
  },  {
      tableName: 'orders',
      timestamps: true
    });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {foreignKey : "order_id"})
    models.OrderItem.belongsTo(Order, {foreignKey : "order_id"})

    Order.belongsTo(models.User, { foreignKey: "user_id" })
    models.User.hasMany(Order, { foreignKey: "user_id" })
  }

  return Order

}