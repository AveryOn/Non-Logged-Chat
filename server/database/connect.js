const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('noLoggerChat', 'postgres', 'root', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    logging: true,
})

module.exports = sequelize;