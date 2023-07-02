<template>
    <div class="main">

        <myIconComp @click="userActions.disconnectUser"></myIconComp>

        <userPage 
        :show="isShowUserPage" 
        :user-data="userCurrentPage"
        :chats="chats"
        @close-user-page="(boolean) => isShowUserPage = boolean"
        @select-chat="selectChat"
        ></userPage>

<!-- CHAT -->
        <div class="chat">

            <!-- IF NO SELECT CHAT -->
            <div class="if-no-select-chat" v-show="!selectedChat.chatID">
                <h1 class="if-no-select-chat__text">
                    Select Chat!
                </h1>
            </div> 

            <!-- CHATS -->
            <span class="panel-chats__open" @click="isShowPanelChats = true"></span>

            <div class="panel-chats" v-show="isShowPanelChats">
                <span class="panel-chats__close" @click="isShowPanelChats = false"></span>
                
                <!-- USERS WRAPPER -->
                <userWrapperComp :users="users" @openUserPage="openUserPage"></userWrapperComp>

                <!-- IF NONE CHATS -->
                <h2 class="if-none-chats__text" v-show="!chats.length">
                    Chats not yet!
                </h2>

                <!-- ITEMS CHAT -->
                <itemChatComp
                v-for="chat in chats"
                :chat-data="chat"
                :key="chat.id"
                @select-chat="selectChat"
                >
                </itemChatComp>
            </div>

            <!-- TOPBAR -->
            <div class="chat__topbar" v-show="selectedChat.chatID">
                <p class="chat__topbar-title">
                    {{ selectedChat?.username }}
                </p>
                <p class="chat___topbar-status">
                    {{ (store.state.activeUsers.includes(selectedChat?.userID))? 'online' : 'offline' }}
                </p>
            </div>
            <!-- BLOCK MESSAGES -->
            <div class="block-messages">
                <!-- триггер блок для подгрузки сообщений -->
                <div class="trigger-messages" v-show="isShowTriggerMessages"></div>

                <!-- NOT YET MESSAGES -->
                <h1 class="if-none-message" v-show="!messages.length && selectedChat.chatID">
                    Messages not yet!
                </h1>                
                <itemMessageComp
                @mount-message="mountMessage"
                @unmount-message="unmountMessage"
                v-for="message in messages"
                :message-data="message"
                :key="message.id"
                >
                    {{ message?.text }}
                </itemMessageComp>
            </div>

            <!-- INPUT -->
            <form class="panel-input" @submit.prevent>
                <inputComp :disabled="!selectedChat.chatID" v-model="messageText" ></inputComp>
                <buttonComp :disabled="!selectedChat.chatID" @click="sendMessage">Send</buttonComp>
            </form>
        </div>

<!-- LOGGER -->
        <div class="logger">
            <h2 class="logger__title">Logger</h2>
            <div class="logger__panel-logs">
                <logComp 
                v-for="(log, index) in store.state.logs" 
                :index-log="index"
                :type-log="log.typeLog"
                :key="log.id"
                >
                    {{ log.message }}
                </logComp>
            </div>
        </div>
    </div>
</template>

<script setup>
import inputComp from '@/components/inputComp.vue';
import buttonComp from '@/components/buttonComp.vue';
import myIconComp from '@/components/myIconComp.vue';
import itemChatComp from '@/components/itemChatComp.vue';
import itemMessageComp from '@/components/itemMessageComp.vue';
import userWrapperComp from '@/components/userWrapperComp.vue';
import userPage from '@/components/userPage.vue';
import logComp from '@/components/logComp.vue';
import { userActions, socket } from '@/socket/socket-config'
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const isShowPanelChats = ref(false);
const isShowUserPage = ref(false);
const isShowTriggerMessages = ref(false);

const messageText = ref('');
const selectedChat = ref({ chatID: null, username: null, userID: null });
const userCurrentPage = reactive({username: '', friends: [], color: ''});
const messages = ref([]);
const users = ref([]);
const chats = ref([]);

// ЦВЕТНОЙ ЛОГ
function logger(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}

function openUserPage(user){
    userCurrentPage.id = user.id;
    userCurrentPage.username = user.username;
    userCurrentPage.friends = user.friends;
    userCurrentPage.color = user.color;
    isShowUserPage.value = true;
}

// Вычисление рандомного цвета
function randColor(){
    // from 0 To 1000
    const colorValue = (+(Math.random().toFixed(3)) * 1000);
    // Цветовая модель hsl, меняем первое значение: тон цвета
    return `hsl(${colorValue} 40% 50%)`
}

// 
function addUser(user){
    const color = randColor();
    const me = JSON.parse(localStorage.getItem('auth'));
    const newUser = {...user};  
    if(newUser?.id === (+me.id)){
        localStorage.setItem('my-color', color);
    }else{
        newUser.color = color;
        users.value.push(newUser);
    }
}

function selectChat(chat){
    store.dispatch('getMessages', { chatID: chat.chatID, limit: 15 })
        .then(response => {
            messages.value = response.messages;
            const blockMessages = document.querySelector('.block-messages');
            // setTimeout ставит выполнение скролла для блока сообщений в цикл событий
            // Нужно для позиции скролла относительно самых новых сообщений
            setTimeout(() => {
                blockMessages.scroll({
                    top: blockMessages.scrollHeight,
                    behavior: "smooth",
                });
                isShowTriggerMessages.value = true;
            }, 0)
            messageText.value = '';
        })
    selectedChat.value = chat;
    isShowPanelChats.value = false;
    isShowUserPage.value = false;
}

// Lazy-loading сообщений по 15шт по достижению скроллом триггерного блока
async function observeTriggerMessage(entries){
    const blockMessages = document.querySelector('.block-messages');
    const beforeScroll = blockMessages.scrollHeight;
    if(entries[0].isIntersecting){
        const response = await store.dispatch('getMessages', { 
            chatID: selectedChat.value.chatID, 
            limit: (messages.value.length + 15) 
        })
        messages.value = response.messages;
        if(response.done){
            // с сервера приходит флаг done Указывающий, что выгружены все сообщения.
            // В этом случае отключаем триггерный блок, чтобы не инициировать лишние запросы к БД
            isShowTriggerMessages.value = false;
        }
        // setTimeout ставит выполнение скролла для блока сообщений в цикл событий
        // Нужно для позиции иммитации, того, что новые сообщения подгружены выше
        setTimeout(() => {
            const afterScroll = blockMessages.scrollHeight;
            blockMessages.scroll({
                top: afterScroll - beforeScroll,
                behavior: "smooth",
            });
        }, 0)
    }
}

function addLog(typeLog, message){
    store.commit('addLog', { typeLog, message })
}
function sendMessage(){
    userActions.createMessage({ 
        chatID: selectedChat.value?.chatID,
        text: messageText.value,
        fromUserID: JSON.parse(localStorage.getItem('auth')).id,
        toUserID: selectedChat.value?.userID,
    })
}

const mountedMessages = ref([]);
function mountMessage(messageObj){
    mountedMessages.value.push(messageObj);
}

function unmountMessage(messageObj){
    mountedMessages.value.splice(mountedMessages.value.indexOf(messageObj), 1);
}

onMounted(() => {
    store.dispatch('getUserChats', {userID: JSON.parse(localStorage.getItem('auth')).id})
        .then((data) => {
            chats.value = data;
        })
    userActions.connectUser();

    // Отслеживание прокрутки блока сообщений для Lazy-loadingа доп.сообщений
    const triggerMessages = document.querySelector('.trigger-messages');
    const observerOptions = {
        root: document.querySelector('.block-messages'),
        threshold: 0,
    }
    const observer = new IntersectionObserver(observeTriggerMessage, observerOptions);
    observer.observe(triggerMessages);

    // Отслеживание прокрутки блока сообщений для иммитации прочитанности сообщений пользователем
    const notReadMessages = [];
    const myID = JSON.parse(localStorage.getItem('auth')).id
    let chatID = null;
    const observerMessages = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            // Если область скролла перекрывает эти сообщения, то они считаются прочитанными
            if(entry.isIntersecting){
                for (const entryMessage of mountedMessages.value) {
                    if(entry.target.id == entryMessage.message.id){
                        if(!entryMessage.message.isRead){
                            if(+entryMessage.message.toUserID === myID){
                                chatID = entryMessage.message.chatID;
                                notReadMessages.push(entryMessage.message.id);
                            }
                        }else{
                            // console.log('hello');
                        }
                    }
                }
            }
        }
        Promise.resolve(socket.emit('read-message', {
            messages: notReadMessages,
            fromUserID: myID,
            toUserID: selectedChat.value.userID,
            chatID
        })).then(() => {
            notReadMessages.length = 0;
        })
    }, observerOptions)
    // setTimeout(() => {
    // }, 500);
    
    watch(() => mountedMessages.value.length, (newValue) => {
        if(newValue > 0){
            for (const entry of mountedMessages.value) {
                entry.messageDOM.isReady = entry.message.isReady;
                observerMessages.observe(entry.messageDOM)
            }
        }
    })

    // Сообщение было прочитано
    socket.on('read-message', (data) => {
        console.log(data);
        store.dispatch('getMessages', { chatID: data.chatID, limit: 15 })
            .then(response => {
                messages.value = response.messages;
            })
    })

    // Получение нового сообщения
    socket.on('send-message', (message) => {
        if(selectedChat.value.chatID == message?.chatID){
            messages.value.push(message);
            const blockMessages = document.querySelector('.block-messages');
            setTimeout(() => {
                blockMessages.scroll({
                    top: blockMessages.scrollHeight,
                    behavior: "smooth",
                });
            }, 10)
            messageText.value = '';
        }
    })

    store.dispatch('getAllUsers', (res) => {
        for (const user of res) {
            user.id = (+user.id)
            addUser(user);
        }
    })
})
</script>

<style scoped>
.main{
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0);
}
.chat{
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 20px;
    top: 20px;
    bottom: 20px;
    display: flex;
    width: 70%;
    border-radius: 10px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    border: 1px solid rgb(54, 54, 54);
    overflow: hidden;
}

.if-no-select-chat{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 50px;
    right: 30px;
    left: 30px;
    height: max-content;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    background-color: rgb(54, 54, 54);
    z-index: 100;
}
.if-no-select-chat__text{
    font-size: 2.5em;
    font-family: sans-serif;
    color: bisque;
}
.panel-chats{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    background: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    z-index: 100;
}

.panel-chats__close{
    position: absolute;
    right: -25px;
    top: 10px;
    width: 20px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgb(189, 75, 75);
    background-color: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    cursor: pointer;
    z-index: 60;
}
.panel-chats__close:hover{
    background-color: rgb(189, 75, 75, .3);
}
.panel-chats__open{
    position: absolute;
    left: 4px;
    top: 35px;
    position: absolute;
    width: 20px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgb(98, 140, 204);
    background-color: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    cursor: pointer;
    z-index: 60;
}
.panel-chats__open:hover{
    background-color: rgba(86, 118, 167, 0.3);
}
.if-none-chats__text{
    margin: auto;
    font-size: 2.5em;
    color: bisque;
}
.block-messages{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
    height: 86%;
    background-color: rgb(46, 53, 53);
    border-radius: 10px;
    margin: 10px auto 10px auto;
    padding: 30px 0 0 0;
    overflow-y: auto;
    overflow-x: hidden;
}
.trigger-messages{
    position: absolute;
    top: 0;
    width: 100%;
    height: 45px;
    background: rgba(0,0,0,0);
}
.chat__topbar{
    position: absolute;
    top: 0;
    width: 100%;
    height: max-content;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 20px;
    position: absolute;
    background: rgba(0,0,0, .5);
    backdrop-filter: blur(5px);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: 50;
}
.chat__topbar-title{
    font-family: sans-serif;
    font-weight: bolder;
    font-size: 1.18em;
}
.chat___topbar-status{
    position: absolute;
    right: 20px;
    bottom: 5px;
    font-family:monospace;
}
.if-none-message{
    position: relative;
    align-self: center;
    margin: auto;
    color: bisque;
    font-size: 3em;
    font-family: sans-serif;
}
.panel-input{
    position: relative;
    width: 95%;
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: rgb(49, 59, 59); */
    border-radius: 10px;
    margin: 5px auto 10px auto;
}
.logger{
    position: absolute;
    width: 25%;
    right: 20px;
    top: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgb(54, 54, 54);
    border-radius: 10px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
}
.logger__title{
    font-size: 2em;
    font-family: sans-serif;
    color: bisque;
    border-bottom: 2px solid bisque;
    margin: 10px;
    cursor: default;
}
.logger__panel-logs{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(46, 53, 53);
    width: 92%;
    border-radius: 10px;
    height: 90%;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>