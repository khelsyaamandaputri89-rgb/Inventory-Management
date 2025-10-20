module.exports = (sequelize, DataTypes) => {
const User = sequelize.define(
  "User", 
  {
    id : {
      type : DataTypes.INTEGER, 
      primaryKey : true, 
      autoIncrement : true
    },
    username : {
      type : DataTypes.STRING, 
      allowNull : false
    },
    email : {
      type : DataTypes.STRING, 
      allowNull : false
    },
    password : {
      type : DataTypes.STRING(225), 
      allowNull : false
    },
    role : {
      type : DataTypes.STRING, 
      allowNull : false
    },
    }, {
      tableName: 'users',
      timestamps: true
    });

    User.associate = (models) => {
      User.hasMany(models.Order, {foreignKey : "user_id"})
      models.Order.belongsTo(User, {foreignKey : "user_id"})

      User.hasMany(models.Product, {foreignKey : "user_id"})
      models.Product.belongsTo(User, {foreignKey : "user_id"})
    }

  return User

}