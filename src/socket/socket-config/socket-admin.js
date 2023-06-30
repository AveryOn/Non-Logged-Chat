// Модуль подключения сокета к администраторскому пространству имен на сервере
import { io } from 'socket.io-client';

// Адрес сервера вебсокет-подключения + пространство имен администратора
const URL = 'http://localhost:4123/admin';

const adminSocket = io(URL, {
    autoConnect: false
})

// Обработчик подключения к серверу
adminSocket.on('connect', () => {
    console.log('adminSocket success connection!');
})

// Обработчик ошибки соединения
adminSocket.on('connect_error', (err) => {
    console.log(err);
})

export {
    adminSocket
};