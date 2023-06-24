import { createStore } from 'vuex'
import router from '@/router';
import axios from 'axios';
import moment from 'moment/moment';

export default createStore({
    state: {
        hostServer: 'http://localhost:3000',
        myID: 321,
        logs: []
    },
    getters: {
    },
    mutations: {
        addLog(state, { typeLog, message }) {
            console.log(typeLog, message);
            const newLog = { id: Date.now(), typeLog, message }
            state.logs.push(newLog);
        }
    },
    actions: {

        // Получение всех пользователей
        getAllUsers({ state, commit }, callback) {
            axios.get(state.hostServer + '/users')
                .then((response) => {
                    return callback(response.data);
                }).catch((err) => {
                    console.log(err);
                })
        },

        // Создание одного пользователя
        createUser({ state, commit }, { username, email, friends, password }) {
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
                    console.log(response.data);
                    const data = response.data;
                    if (data?.status === 'Error') {
                        if (data?.target.length) {
                            for (const error of data?.target) {
                                console.log(new Error(`Причина ошибки: ${error.validatorKey}, Цель: ${error.path}`));
                            }
                        } else {
                            console.log(new Error(`Причина ошибки: ${data?.target.validatorKey}, Цель: ${data?.target.path}`));
                        }
                    } else {
                        localStorage.setItem('auth', JSON.stringify(data));
                        router.push({ name: 'chat' });
                    }
                }, (err) => {
                    console.log(err);
                }
            )
        },

        // Создание нового Чата ДВУХ ПОЛЬЗОВАТЕЛЕЙ 
        createChat({ state, commit }, { firstUserID, secondUserID }){
            const newChat = {
                id: 1687381045137,
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

        }

    },
    modules: {
    }
})
