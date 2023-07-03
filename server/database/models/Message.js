// Таблица СООБЩЕНИЙ
const { DataTypes } = require('sequelize');
const sequelize = require('../connect');

const Message = sequelize.define('message', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    text: { type: DataTypes.TEXT },
    fromUserID: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    toUserID: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
})

module.exports = Message;

