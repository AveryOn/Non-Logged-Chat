// Модуль действий для сообщений
const sequelize = require('../connect');
const { Op } = require('sequelize');
const { Chat, User, Message } = require('../models');

// Получить сообщения
async function getMessages(chatID, limit, callback) {
    const transaction = await sequelize.transaction();
    try {
        const amount = await Message.count({
            where: {
                chatID
            }
        })
        if (amount >= limit) {
            const messages = await Message.findAll({
                where: {
                    chatID,
                },
                offset: amount - limit,
                order: [['id', 'ASC']]
            });
            await transaction.commit();
            return callback({ messages, done: false });
        } else {
            const offset = limit - amount;
            if (offset >= 0) {
                const messages = await Message.findAll({
                    where: {
                        chatID,
                    },
                    offset: 0
                });
                await transaction.commit();
                return callback({ messages, done: true });
            }
        }
    } catch (err) {
        callback(err);
        console.log(err);
        await transaction.rollback();
    }
}

// Создает сообщение. Если чата еще не существовало, сначала создает его, потом добавляет сообщение в него
async function createMessage(messageID, text, fromUserID, toUserID, createdAt, chatID) {
    const transaction = await sequelize.transaction();
    try {
        const [chat, created] = await Chat.findOrCreate({
            where: {
                id: chatID
            },
            defaults: {
                id: chatID,
                createdAt,
            }
        })
        if (created) {
            const firstUser = await User.findByPk(fromUserID);
            const secondUser = await User.findByPk(toUserID);
            await chat.addUsers([firstUser, secondUser]);
        }
        const message = await chat.createMessage({
            id: messageID,
            text,
            fromUserID,
            toUserID,
            createdAt,
        }, { raw: true });
        const response = { fromUserID, toUserID, created, chatID, message }
        // callback(response)
        await transaction.commit();
        return response;
    } catch (err) {
        // callback(err)
        console.log(err);
        await transaction.rollback();
    }
}

// Задает сообщению состояние прочитанного
async function readMessage(messagesID) {
    const transaction = await sequelize.transaction();
    try {
        await Message.update({ isRead: true }, {
            where: {
                id: {
                    [Op.in]: messagesID
                }
            }
        })
        // const messages = await Message.findAll({
        //     where: {
        //         id: {
        //             [Op.in]: messageID
        //         }
        //     }
        // })
        // messages.forEach(async(message) => {
        //     await Message.update({ isRead: true }, {
        //         where: {
        //             id: message.id
        //         }
        //     });
        // })
        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
    }
}

module.exports = {
    createMessage,
    getMessages,
    readMessage,
}
