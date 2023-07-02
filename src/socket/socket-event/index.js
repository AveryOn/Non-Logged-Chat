// Модуль прослушки событий для socket базового пространства имен
import { socket } from "../socket-config";
import store from "@/store";

// Обработчик подключения к серверу
socket.on('connect', () => {
    // console.log('defaultSocket success connection!');
})

// Обработчик ошибки соединения
socket.on('connect_error', (err) => {
    console.log(err);
})

// Обработчик ошибки запроса
socket.on('requiest-error', (err) => {
    console.log(err);
})

// <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> 

socket.on('first-connect', (data) => {
    console.log(data);
})

// Получение пользователей. Обновляется когда подключается новый сокет
socket.on('user', (userList) => {
    const idNumber = [];
    for (let id of userList) {
        id =+ id;
        if(typeof id === 'number'){
            idNumber.push(id);
        }
    }
    store.commit('updateActiveUsers', idNumber);
});

