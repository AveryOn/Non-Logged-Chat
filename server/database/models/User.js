// Таблица ПОЛЬЗОВАТЕЛЬ
const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    friends: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
})

module.exports = User;