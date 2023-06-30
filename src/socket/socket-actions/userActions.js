import { socket } from '../socket-config/socket';

function connectUser(){
    const userID = JSON.parse(localStorage.getItem('auth'))?.id;
    const username = JSON.parse(localStorage.getItem('auth'))?.username;
    socket.auth = { userID, username }
    socket.connect();
}

function disconnectUser(){
    socket.disconnect();
}

export default {
    connectUser,
    disconnectUser,
}