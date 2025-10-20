'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable(
        "orders", 
        {
            id : {
                type : Sequelize.INTEGER, 
                primaryKey : true, 
                autoIncrement : true
            },
            order_date : {
                type : Sequelize.DATE, 
                allowNull : false
            },
            user_id : {
                type : Sequelize.INTEGER, 
                allowNull : false,      
                references: {model: "users", key: "id"},
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            status : {
                type : Sequelize.STRING,
                allowNull : false
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
   await queryInterface.dropTable("orders");
  }
};
