<template>
    <div class="main">

        <myIconComp @click="userActions.disconnectUser"></myIconComp>

        <userPage 
        :show="isShowUserPage" 
        :user-data="userCurrentPage"
        @close-user-page="isShowUserPage = false"
        @select-chat="selectChat"
        ></userPage>

<!-- CHAT -->
        <div class="chat">

            <!-- IF NO SELECT CHAT -->
            <div class="if-no-select-chat" v-show="!selectedChat">
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

                <itemChatComp
                v-for="chat in chats"
                :title-chat="selectedChat.titleChat"
                :body-chat="selectedChat.bodyChat"
                :key="chat.id"
                >
                </itemChatComp>
            </div>

            <!-- MESSAGES -->
            <div class="block-messages">

                <!-- TOPBAR -->
                <div class="chat__topbar">
                    <p class="chat__topbar-title">
                        {{ selectedChat?.titleChat }}
                    </p>
                    <p class="chat___topbar-status">
                        {{ selectedChat?.userStatus }}
                    </p>
                </div>

                <h1 class="if-none-message" v-show="!messages.length && selectedChat">
                    Messages not yet!
                </h1>                
                <itemMessageComp
                v-for="message in messages"
                :message-data="message"
                :key="message.id"
                >
                    {{ message?.text }}
                </itemMessageComp>
            </div>

            <!-- INPUT -->
            <form class="panel-input" @submit.prevent>
                <inputComp :disabled="!selectedChat" v-model="messageText" ></inputComp>
                <buttonComp :disabled="!selectedChat" @click="sendMessage">Send</buttonComp>
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
import { userActions } from '@/socket/socket-config'
import moment from 'moment';
import { ref, reactive, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const isShowPanelChats = ref(false);
const isShowUserPage = ref(false);

const messageText = ref('');
const selectedChat = ref(null);
const userCurrentPage = reactive({username: '', friends: [], color: ''});
const messages = ref([]);
const users = ref([]);
const chats = ref([]);

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

function addUser(user){
    const color = randColor();
    const me = JSON.parse(localStorage.getItem('auth'));
    const newUser = {...user};  
    if(newUser?.id === me.id){
        localStorage.setItem('my-color', color);
    }else{
        newUser.color = color;
        users.value.push(newUser);
    }
}

function selectChat(chat){
    selectedChat.value = chat;
    isShowPanelChats.value = false;
    isShowUserPage.value = false;
}

function addLog(typeLog, message){
    store.commit('addLog', { typeLog, message })
}
function sendMessage(){
    const newMessage = {
        id: Date.now(),
        text: messageText.value,
        fromUserID: 321,
        toUserID: 123,
        createdAt: moment(Date.now()).format('HH:mm'),
    }
    messages.value.push(newMessage);
    const blockMessages = document.querySelector('.block-messages');
    setTimeout(() => {
        blockMessages.scroll({
            top: blockMessages.scrollHeight,
            behavior: "smooth",
        });
    }, 10)
    messageText.value = '';
}

onMounted(() => {
    userActions.connectUser();
    store.dispatch('getAllUsers', (res) => {
        for (const user of res) {
            addUser(user);
        }
    })

    const panelLogs = document.querySelector('.logger__panel-logs');
    watch(store.state.logs, (newValue) => {
        setTimeout(() => {
            panelLogs.scroll({
                top: panelLogs.scrollHeight,
                behavior: "smooth",
            });
        }, 10)
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
}
.panel-chats__close:hover{
    background-color: rgb(189, 75, 75, .3);
}
.panel-chats__open{
    position: absolute;
    left: 4px;
    top: 10px;
    position: absolute;
    width: 20px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgb(98, 140, 204);
    background-color: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    cursor: pointer;
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
    overflow-y: auto;
    overflow-x: hidden;
}
.chat__topbar{
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
    margin: 6px;
}
.chat___topbar-status{

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