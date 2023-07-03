const { io } = require('./socket-server');
const { messageActions, userActions } = require('../database/actions');

// Промежуточное ПО по-умолчанию
io.use((socket, next) => {
    const userID = socket.handshake.auth.userID;
    const username = socket.handshake.auth.username;
    // Возврат ошибки на клиент
    if (!userID || !username) {
        return next(new Error('userID OR Username not found'));
    }
    socket.userID = userID;
    socket.username = username;
    next();
})

const users = [];
io.on('connection', (socket) => {
    console.log('connect!', socket.username);
    users.push(socket.userID);
    // Пример названия комнаты 'room_1688127235524'
    socket.join('room_' + socket.userID);
    // Отправка учетных данных на клиент при подключении
    socket.emit('first-connect', `Your credentials data: username: ${socket.username}, id: ${socket.userID}`);
    // Отправка списка пользователей при новом подключении
    io.emit('user', users);


    // Отправка сообщения между двумя User
    socket.on('send-message', (messageData) => {
        const { messageID, text, fromUserID, toUserID, createdAt, chatID } = messageData;
        // Создание сообщения в БД
        messageActions.createMessage(messageID, text, fromUserID, toUserID, createdAt, chatID)
            .then((response) => {
                response
                io
                    .to('room_' + messageData.fromUserID)
                    .to('room_' + messageData.toUserID)
                    .emit('send-message', (response.message));
            }).catch(err => {
                socket.emit('requiest-error', err);
            })
    });


    // Чтение сообщения
    socket.on('read-message', (data) => {
        if(data.messages.length){
            messageActions.readMessage(data.messages).then(() => {
                io
                // .to('room_' + socket.userID)
                .to('room_' + data.toUserID)
                .emit('read-message', data);
            });
        }
    })


    // Disconnect
    socket.on('disconnect', () => {
        console.log('disconnect: ', socket.username);
        users.splice(users.indexOf(socket.userID), 1);
        socket.broadcast.emit('user', users)
    })

});


