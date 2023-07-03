// Таблица ЧАТ
const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const Chat = sequelize.define('chat', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
})

module.exports = Chat;