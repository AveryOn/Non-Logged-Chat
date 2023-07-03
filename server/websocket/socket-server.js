const server = require('http').createServer();
const { Server } = require('socket.io');
// Сервер запускающий соединение вебсокета
const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:8080', 
            'http://localhost:8081',
            'http://192.168.1.52:8080',
            'http://192.168.1.52:8081',
        ],
        allowEIO3: true,
        methods: ['POST, DELETE, GET, PUT'],
        credentials: false,
    },
})

server.listen(4123, () => {
    console.log(`Socket.IO Server has been start on: http://localhost:4123`);
});

module.exports = {
    io
};