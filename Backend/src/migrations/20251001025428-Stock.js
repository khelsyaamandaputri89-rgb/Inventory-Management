'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(
        "stocks", 
        {
            id : {
                type : Sequelize.INTEGER, 
                primaryKey : true, 
                autoIncrement : true
            },
            product_id : {
                type : Sequelize.INTEGER, 
                allowNull : false,
                references: {model: "products", key: "id"},
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            change_type : {
                type : Sequelize.STRING, 
                allowNull : false
            },
            quantity : {
                type : Sequelize.INTEGER, 
                allowNull : false
            },
            stock_akhir : {
                type : Sequelize.INTEGER,
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

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("stocks");
    }
};
