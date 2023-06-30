// Модуль прослушки событий для socket базового пространства имен
import { socket } from "../socket-config";
import store from "@/store";

// Обработчик подключения к серверу
socket.on('connect', () => {
    console.log('defaultSocket success connection!');
})

// Обработчик ошибки соединения
socket.on('connect_error', (err) => {
    console.log(err);
})

// <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> <?php~> 

socket.on('first-connect', (data) => {
    console.log(data);
})

socket.on('user', (userList) => {
    store.commit('updateActiveUsers', userList);
});
