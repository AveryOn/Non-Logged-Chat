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

// Создание сообщения c ответом или без
function createMessage({ isReply, chatID, text, fromUserID, fromUsername, toUserID }) {
    const newMessage = {
        isReply,
        messageID: Date.now(),
        text,
        fromUserID,
        toUserID,
        chatID,
        fromUsername,
    }
    try {
        socket.emit('send-message', newMessage);
    } catch (err) {
        console.log(err);
    }
}

function createReplyMessage({ isReply, fromUsername, text, fromUserID, toUserID, replyToID, replyToContent, chatID }) {
    const newMessage = {
        isReply,
        fromUsername,
        messageID: Date.now(),
        text,
        fromUserID,
        toUserID,
        replyToID,
        replyToContent,
        chatID,
    }
    try {
        socket.emit('send-message', newMessage);
    } catch (err) {
        console.log(err);
    }
}

export default {
    connectUser,
    disconnectUser,
    createMessage,
    createReplyMessage,
}