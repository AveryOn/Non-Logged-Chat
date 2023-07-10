import { createStore } from 'vuex'
import router from '@/router';
import axios from 'axios';
import moment from 'moment/moment';

export default createStore({
    state: {
        hostServer: 'http://localhost:3000',
        logs: [],
        activeUsers: [],
    },
    getters: {
    },
    mutations: {
        addLog(state, { typeLog, message }) {
            console.log(typeLog, message);
            const newLog = { id: Date.now(), typeLog, message }
            state.logs.push(newLog);
        },
        updateActiveUsers(state, userList) {
            state.activeUsers = userList;
        }
    },
    actions: {

        // Получение всех пользователей
        getAllUsers({ state }, callback) {
            axios.get(state.hostServer + '/users')
                .then((response) => {
                    return callback(response.data);
                }).catch((err) => {
                    console.log(err);
                })
        },

        // Получение чатов пользователя
        async getUserChats({ state }, { userID }) {
            try {
                const response = await axios.get(state.hostServer + `/chats/get-chats/${userID}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                localStorage.setItem('my-chats', JSON.stringify(response.data));
                return response.data;
            } catch (err) {
                console.log(err);
            }

        },

        // Создание одного пользователя
        createUser({ state }, { username, email, friends, password }) {
            axios.post(state.hostServer + '/users/create-user', {
                id: Date.now(),
                username,
                email,
                friends,
                password
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(
                (response) => {
                    const data = response.data
                    data.id = (+data.id);
                    localStorage.setItem('auth', JSON.stringify(data));
                    router.push({ name: 'chat' });
                }, (err) => {
                    console.log(err);
                }
            )
        },

        // Создание нового Чата ДВУХ ПОЛЬЗОВАТЕЛЕЙ 
        createChat({ state }, { firstUserID, secondUserID }) {
            const newChat = {
                id: Date.now(),
                firstUserID,
                secondUserID,
                createdAt: moment(Date.now()).format('DD.MM.YYYY HH:mm:ss'),
            }
            axios.post(state.hostServer + '/chats/create-chat', {
                ...newChat
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then((res) => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },

        // Получение массива сообщений определенного чата
        async getMessages({ state }, { chatID, userID, limit }) {
            try {
                const response = await axios.get(state.hostServer + `/message/${userID}/${chatID}/${limit}`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                return response.data;
            } catch (err) {
                console.log(err);
            }
        },

        // Удаление сообщений
        async deleteMessages({ state }, { messagesID, userID, isAllUsers }) {
            try {
                axios.post(state.hostServer + `/message/delete`, {
                    messagesID,
                    userID,
                    isAllUsers,
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(response => {
                    console.log(response);
                })
            } catch (err) {
                console.log(err);
            }
        },

        // Поиск сообщения на которое ссылается ответное сообщение
        async findReplyingMessage({ state }, { messageID, chatID, userID }) {
            try {
                const response = await axios.post(state.hostServer + `/message/find-message`, {
                    messageID,
                    chatID,
                    userID,
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                return response.data;
            } catch (err) {
                console.log(err);
            }
        }

    },
    modules: {
    }
})
