const messageRouter = require('express').Router();
const { messageActions } = require('../database/actions');

// Получить сообщения
messageRouter.get('/:chatID/:limit', (req, res) => {
    const { chatID, limit } = req.params;
    messageActions.getMessages(chatID, limit, (response) => {
        res.send({messages: response.messages, done: response.done});
    })
})

// Создать сообщение
messageRouter.post('/create/', (req, res) => {
    const { chatID, text, messageID, fromUserID, toUserID, createdAt } = req.body;
    messageActions.createMessage(messageID, text, fromUserID, toUserID, createdAt, chatID, (response) => {
        messageEvent.emit('send-message', response.message.text)
        res.send(response.message);
    })
})

// Прочитать сообщение
messageRouter.post('read', (req, res) => {
    const { messageID } = req.body;
    messageActions.readMessage(messageID, (response) => {
        
    })
})

module.exports = messageRouter;