'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable(
        "products", 
        {
            id : {
                type : Sequelize.INTEGER, 
                primaryKey : true, 
                allowNull : false, 
                autoIncrement : true
            },
            name : {
                type : Sequelize.STRING, 
                allowNull : false
            },
            price : {
                type : Sequelize.DECIMAL(12, 2), 
                allowNull : false
            },
            stock : {
                type : Sequelize.INTEGER, 
                defaultValue : 0
            },
            user_id: {
                type: Sequelize.INTEGER, 
                allowNull: false, 
                references: {model: "users", key: "id"},
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            category_id: {
                type: Sequelize.INTEGER, 
                allowNull: false, 
                references: {model: "categories", key: "id"},
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
    await queryInterface.dropTable("products");
  }
};
