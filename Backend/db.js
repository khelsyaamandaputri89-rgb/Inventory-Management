const { Sequelize } = require("sequelize")
const config = require("./src/config/config.json") ["development"]
require("dotenv").config()

const sequelize = new Sequelize (
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
       host : process.env.DB_HOST,
       port : process.env.DB_PORT,
       dialect : "postgres",
       loggig : false
    }
)

sequelize.authenticate()
   .then(() => console.log('koneksi dengan database berhasil'))
   .catch(err => console.log('Error' + err))

module.exports = sequelize;