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
        forwardedMsg: [],
    }
    console.log('Выполнилось: createMessage');
    try {
        socket.emit('send-message', newMessage);
    } catch (err) {
        console.log(err);
    }
}
// Отправка сообщения с ответом на выбранное сообщение (reply-сообщение)
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
        forwardedMsg: [],
        chatID,
    }
    console.log('Выполнилось: createReplyMessage');
    try {
        socket.emit('send-message', newMessage);
    } catch (err) {
        console.log(err);
    }
}

// Отправка сообщения, содержащее коллекцию сообщений для пересылки другому чату
function createForwardedMessage({
    isReply,
    fromUsername,
    text,
    fromUserID,
    toUserID,
    replyToID,
    replyToContent,
    forwardedMessages,
    chatID,
}) {
    const newMessage = {
        isReply,
        fromUsername,
        messageID: Date.now(),
        text,
        fromUserID,
        toUserID,
        replyToID,
        replyToContent,
        forwardedMsg: forwardedMessages,
        chatID,
    }
    console.log('Выполнилось: createForwardedMessage');
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
    createForwardedMessage,
}