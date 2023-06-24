// Модуль настройки подключения для всех пользователей
import { io } from 'socket.io-client';

// Адрес вебсокет-сервера запускается на другом порте, отличном от порта основного сервера (3000)
const URL = 'http://localhost:4123';

// Создать сокет-подключение без возможности его автоматического подключения
const socket = io(URL, {
    autoConnect: false
});

// Обработчик подключения к серверу
socket.on('connect', () => {
    console.log('success connection!');
})

// Обработчик ошибки соединения
socket.on('connect_error', (err) => {
    console.log(err);
})

export default socket;