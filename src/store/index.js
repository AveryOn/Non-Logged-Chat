import { createStore } from 'vuex'

export default createStore({
    state: {
        myID: 321,
        logs: [
            { id: Date.now(), typeLog: 'error', message: 'Hello something text!' },
            { id: Date.now(), typeLog: 'usual', message: 'Hello someta123hing text!' },
        ]
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
    },
    modules: {
    }
})
