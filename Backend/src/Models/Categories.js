module.exports = (sequelize, DataTypes) => {
 const Categories = sequelize.define(
    "Categories", 
    {
    id : {
        type : DataTypes.INTEGER, 
        primaryKey : true, 
        autoIncrement : true
    },
    name : {
        type : DataTypes.STRING, 
        allowNull : false
    },
    description : {
        type : DataTypes.STRING, 
        allowNull : true
    }
    }, {
        tableName : "categories",
        timestamps : true
    }
)

    Categories.associate = (models) => {
    Categories.hasMany(models.Product, {foreignKey : "category_id"})
    models.Product.belongsTo(Categories, {foreignKey : "category_id"})
    }

    return Categories
 }