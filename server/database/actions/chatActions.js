// Модуль действий для чатов
const sequelize = require('../connect');
const { Chat, User } = require('../models');


// Получение чатов пользователя
async function getUserChats(userID, callback) {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.findByPk(userID);
        const userChats = [];
        for (const entry of await user.getChats()) {
            for (const entryUser of await entry.getUsers({ attributes: ['id', 'username'], joinTableAttributes: ['chatId'] })) {
                if (userID !== entryUser.id) {
                    const readyChat = {
                        userID: entryUser.id,
                        username: entryUser.username,
                        chatID: entryUser.userChat.chatId,
                    }
                    userChats.push(readyChat);
                }
            }
        }
        callback(userChats);
        await transaction.commit();
    } catch (err) {
        callback(err);
    }
}

// Создание Чата для ДВУХ ПОЛЬЗОВАТЕЛЕЙ
async function createChat(id, firstUserID, secondUserID, createdAt, callback) {
    const transaction = await sequelize.transaction();
    try {
        const firstUser = await User.findByPk(firstUserID);
        const secondUser = await User.findByPk(secondUserID);

        const newChat = await Chat.create({
            id,
            createdAt,
        });
        await newChat.addUsers([firstUser, secondUser]);
        await transaction.commit();
        return callback('success');
    } catch (err) {
        await transaction.rollback();
        return callback(err);
    }
}

module.exports = {
    createChat,
    getUserChats
}