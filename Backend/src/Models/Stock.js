module.exports = (sequelize, DataTypes) => {
const Stock = sequelize.define(
    "Stock", 
    {
        id : {
        type : DataTypes.INTEGER, 
        primaryKey : true, 
        autoIncrement : true
    },
    product_id : {
        type : DataTypes.INTEGER, 
        allowNull : false,
        references: {model: "products", key: "id"},
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    change_type : {
        type : DataTypes.STRING, 
        allowNull : false
    },
    quantity : {
        type : DataTypes.INTEGER, 
        allowNull : false
    },
    stock_akhir : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
    }, {
        tableName : "stocks",
        timestamps : true,
        underscored : false
    })

    return Stock
    
}