import { socket } from '../socket-config/socket';
import moment from 'moment';

function connectUser() {
    const userID = JSON.parse(localStorage.getItem('auth'))?.id;
    const username = JSON.parse(localStorage.getItem('auth'))?.username;
    socket.auth = { userID, username }
    socket.connect();
}

function disconnectUser() {
    socket.disconnect();
}

// Создание сообщения
function createMessage({ chatID, text, fromUserID, toUserID }) {
    const newChat = {
        messageID: Date.now(),
        chatID,
        text,
        fromUserID,
        toUserID,
        createdAt: moment(Date.now()).format('DD.MM.YYYY HH:mm:ss'),
    }
    try {
        socket.emit('send-message', newChat);
    } catch (err) {
        console.log(err);
    }
}

export default {
    connectUser,
    disconnectUser,
    createMessage,
}