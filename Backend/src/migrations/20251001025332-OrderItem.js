'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
        "order_items", 
        {
            id : {
                type : Sequelize.INTEGER, 
                primaryKey : true, 
                allowNull : false, 
                autoIncrement : true
            },
            quantity : {
                type : Sequelize.INTEGER, 
                allowNull : false
            },
            product_price : {
                type : Sequelize.DECIMAL(12, 2), 
                allowNull : false
            },
            total_price : {
                type : Sequelize.DECIMAL(12, 2), 
                allowNull : false
            },
            order_id : {
                type : Sequelize.INTEGER, 
                allowNull : false,
                references: {model: "orders", key: "id"},
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            product_id : {
                type : Sequelize.INTEGER, 
                allowNull : false,
                references: {model: "products", key: "id"},
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            createdAt: { 
                type: Sequelize.DATE, 
                allowNull: false 
            },
            updatedAt: { 
                type: Sequelize.DATE, 
                allowNull: false 
            }
        });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("order_items");
  }
};
