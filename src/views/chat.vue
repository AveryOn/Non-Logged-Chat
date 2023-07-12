<template>
    <div class="main">

        <myIconComp @click="userActions.disconnectUser"></myIconComp>
        <notifyComp v-show="isShowNotifyNewMessage" :notify-data="notifyData"></notifyComp>

        <userPage 
        :show="isShowUserPage" 
        :user-data="userCurrentPage"
        :chats="chats"
        @close-user-page="(boolean) => isShowUserPage = boolean"
        @select-chat="selectChat"
        ></userPage>

<!-- CHAT -->
        <div class="chat">
            
            <!-- Подтверждение удаления сообщения -->
            <askDeleteComp 
            :show="isAskDelete" 
            @close="isAskDelete = false"
            @delete-for-me="deleteMessages"
            @delete-for-everyone="deleteMessages"
            ></askDeleteComp>

            <!-- Окно для выбора чата куда отправлять пересланные сообщения -->
            <askForwardedChatComp
            :show="isShowChats"
            :chats="chats"
            @select-chat="selectChat"
            @close="isShowChats = false"
            >
            </askForwardedChatComp>

            <!-- IF NO SELECT CHAT -->
            <div class="if-no-select-chat" v-show="!selectedChat.chatID">
                <h1 class="if-no-select-chat__text">
                    Select Chat!
                </h1>
            </div> 

            <!-- CHATS -->
            <span class="panel-chats__open" @click="openPanelChats"></span>

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
                v-if="isShowPanelChats"
                :chat-data="chat"
                :key="chat.id"
                @select-chat="selectChat"
                >
                </itemChatComp>
            </div>

            <!-- TOPBAR -->
            <div class="chat__topbar" v-show="selectedChat.chatID">
                <!-- USER WRITE -->
                <span class="user-write-message" v-show="userWriteMessage.isShow.value">
                    <p>
                        {{ userWriteMessage.data.value }}
                    </p>
                </span>
                <p class="chat__topbar-title">
                    {{ selectedChat?.username }}
                </p>
                <p class="chat___topbar-status">
                    {{ (store.state.activeUsers.includes(selectedChat?.userID))? 'online' : 'offline' }}
                </p>
            </div>

            <!-- TOOLS BAR -->
            <toolsBarComp 
            :show="selectedMessages.length > 0"
            @delete-messages="isAskDelete = true"
            @forward-messages="forwardMessages"
            >
            </toolsBarComp>

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
                @is-select="selectMessage"
                @reply="selectReplyMessage"
                @find-message="findMessage"
                v-for="message in messages"
                :message-data="message"
                :is-reset-selection="(selectedMessages.length)? false : true"
                :key="message.id"
                >
                    {{ message?.text }}
                </itemMessageComp>
                <!-- Ответ на сообщение -->
                <fillReplyMessageComp
                v-if="selectedReplyMessage.replyToID"
                :content="selectedReplyMessage.replyToContent"
                :username="selectedChat.username"
                @cancel-reply="cancelReplyMessage"
                >
                </fillReplyMessageComp
                >
                <!-- Блок отображает сколько выбрано сообщений для пересылки -->
                <fillForwardedMessagesComp
                v-else
                :forwarded-messages-count="forwardedMessages.length"
                v-show="isForwardMessages && forwardedMessages.length"
                @cancel-forward="cancelForwardMessages"
                >
                </fillForwardedMessagesComp>
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
import toolsBarComp from '@/components/toolsBarComp.vue';
import askDeleteComp from '@/components/askDeleteComp.vue';
import askForwardedChatComp from '@/components/askForwardedChatComp.vue';
import inputComp from '@/components/inputComp.vue';
import buttonComp from '@/components/buttonComp.vue';
import myIconComp from '@/components/myIconComp.vue';
import itemChatComp from '@/components/itemChatComp.vue';
import itemMessageComp from '@/components/itemMessageComp.vue';
import fillReplyMessageComp from '@/components/fillReplyMessageComp.vue';
import fillForwardedMessagesComp from '@/components/fillForwardedMessagesComp.vue';
import userWrapperComp from '@/components/userWrapperComp.vue';
import userPage from '@/components/userPage.vue';
import notifyComp from '@/components/notifyComp.vue';
import logComp from '@/components/logComp.vue';
import { userActions, socket } from '@/socket/socket-config'
import LazyLoadingModule from '@/tools/lazyloading';
import { draftStorageUpdate } from '@/tools/draftStorage';
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const isShowPanelChats = ref(false);
const isShowUserPage = ref(false);
const isShowTriggerMessages = ref(false);
const isShowNotifyNewMessage = ref(false);
const isAskDelete = ref(false);
// Проверка временем
// const isFindMessage = ref(false);
const isShowChats = ref(false);
const isForwardMessages = ref(false);
const userWriteMessage = {
    isStop: ref(false),
    isShow: ref(false),
    data: ref(''),
};

const messageText = ref('');
const selectedChat = ref({ chatID: null, username: null, userID: null });
const selectedMessages = ref([]);
const selectedReplyMessage = ref({ replyToID: null, replyToContent: null })
const userCurrentPage = reactive({username: '', friends: [], color: ''});
const forwardedMessages = ref([]);
const messages = ref([]);
const users = ref([]);
const chats = ref([]);
const notifyData = ref(null);

// ЦВЕТНОЙ ЛОГ
function logger(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}
logger.red = 'hsl(355, 48%, 48%)';
logger.green = 'hsl(100, 50%, 45%)';
logger.blue = 'hsl(180, 50%, 45%)';
logger.yel = 'hsl(405, 50%, 45%)';

// Открыть страницу пользователя. Нажатие на мини-иконку
function openUserPage(user){
    userCurrentPage.id = user.id;
    userCurrentPage.username = user.username;
    userCurrentPage.friends = user.friends;
    userCurrentPage.color = user.color;
    isShowUserPage.value = true;
}

// Открыть панель чатов
function openPanelChats(){
    isShowPanelChats.value = true;
    store.dispatch('getUserChats', { userID: JSON.parse(localStorage.getItem('auth')).id })
        .then((data) => {
            chats.value = data;
        })
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

// Заполняет массивы selectedMessages и forwardedMessages
function selectMessage(message, isSelect){
    if(isSelect){
        if(!selectedMessages.value.includes(message.id)){
            selectedMessages.value.push(message.id);
        }
        if(!forwardedMessages.value.includes(message)){
            forwardedMessages.value.push(message);
        }
    } else {
        selectedMessages.value.splice(selectedMessages.value.indexOf(message.id), 1);
        forwardedMessages.value.splice(forwardedMessages.value.indexOf(message.id), 1);
    }
}

// Добавляет данные reply-сообщения
function selectReplyMessage(message){
    // const draftStorage = JSON.parse(localStorage.getItem('draft'))[selectedChat.value.chatID];
    const blockMessages = document.querySelector('.block-messages');
    selectedReplyMessage.value = { 
        replyToID: message.id,
        replyToContent: message.text  
    }
    // Если в черновике сохранены пересланные сообщения, то очищать их
    draftStorageUpdate(selectedChat.value.chatID, null, selectedReplyMessage.value, 0, 0);

    setTimeout(() => {
        blockMessages.scroll({
            top: blockMessages.scrollHeight,
            behavior: "smooth",
        });
    }, 0)
}

// Отменяет выделение reply-сообщения
function cancelReplyMessage() {
    draftStorageUpdate(selectedChat.value.chatID, null, 0, null, null);
    selectedReplyMessage.value = { 
        replyToID: null,
        replyToContent: null  
    }
}

// Поиск сообщения по его ссылке в reply-сообщении
function findMessage(replyToID){
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    const blockMessages = document.querySelector('.block-messages');
    let isFound = false;
    messages.value.forEach(message => {
        if(message.id == replyToID){
            isFound = true;
            const findMessage = document.getElementById(message.id);
            blockMessages.scroll({
                top: findMessage.offsetTop - 50,
                behavior: "smooth",
            });
            message.isFindMessage = true;
            // Через время подсветка найденного сообщения отключается
            setTimeout(() => {
                delete message.isFindMessage;
            }, 1200);
        }
    })
    if(!isFound){
        store.dispatch('findReplyingMessage', { 
            messageID: replyToID,
            chatID: selectedChat.value.chatID, 
            userID: myID, 
        }).then(response => {
            messages.value = response.messages;
            for (const entry of messages.value) {
                if(entry.id == response.foundMessageID){
                    setTimeout(() => {
                        entry.isFindMessage = true;
                        const findMessage = document.getElementById(response.foundMessageID);
                        if(response.done){
                            blockMessages.scroll({
                                top: findMessage.offsetTop - 15,
                                behavior: "smooth",
                            });
                        } else {
                            blockMessages.scroll({
                                top: findMessage.offsetTop - 50,
                                behavior: "smooth",
                            });
                        }
                    }, 0)
                    setTimeout(() => {
                        delete entry.isFindMessage;
                    }, 1200);
                    break;
                }
            }
            return;
        })
    }
}

// Выбор чата
function selectChat(chat, isForward){
    if(!isForward){
        const draftStorage = JSON.parse(localStorage.getItem('draft'))[chat.chatID];
        messageText.value = draftStorage.messageText;
        forwardedMessages.value = draftStorage.forwardedMessages;
        isForwardMessages.value = draftStorage.isForwardMessages;
        selectedReplyMessage.value = draftStorage.replyMessage;
    } 
    else {
        isForwardMessages.value = true;
        draftStorageUpdate(chat.chatID, null, 0, true, forwardedMessages.value);
    }
    selectedMessages.value = [];
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    store.dispatch('getMessages', { chatID: chat.chatID, userID: myID, limit: 15 })
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
        })
    selectedChat.value = chat;
    isShowPanelChats.value = false;
    isShowUserPage.value = false;
}

// Lazy-loading сообщений по 15шт по достижению скроллом триггерного блока
async function observeTriggerMessage(entries){
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    const blockMessages = document.querySelector('.block-messages');
    const beforeScroll = blockMessages.scrollHeight;
    if(entries[0].isIntersecting){
        const response = await store.dispatch('getMessages', { 
            chatID: selectedChat.value.chatID,
            userID: myID,
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

// Проверка временем
// function addLog(typeLog, message){
//     store.commit('addLog', { typeLog, message })
// }

// Отправка сообщения другому пользователю
function sendMessage(){
    // Обычная отправка сообщения
    if(!selectedReplyMessage.value.replyToID && !forwardedMessages.value.length) {
        userActions.createMessage({ 
            isReply: false,
            fromUsername: JSON.parse(localStorage.getItem('auth')).username,
            text: messageText.value,
            fromUserID: JSON.parse(localStorage.getItem('auth')).id,
            toUserID: selectedChat.value.userID,
            chatID: selectedChat.value?.chatID,
        })
    }
    // Отправка сообщения с ответом на выбранное сообщение (reply-сообщение)
    else if(selectedReplyMessage.value.replyToID && !forwardedMessages.value.length) {
        userActions.createReplyMessage({ 
            isReply: true,
            fromUsername: JSON.parse(localStorage.getItem('auth')).username,
            text: messageText.value,
            fromUserID: JSON.parse(localStorage.getItem('auth')).id,
            toUserID: selectedChat.value?.userID,
            replyToID: selectedReplyMessage.value.replyToID,
            replyToContent: selectedReplyMessage.value.replyToContent,
            chatID: selectedChat.value.chatID,
        })
    }
    // Отправка сообщения, содержащее коллекцию сообщений для пересылки другому чату
    else if (forwardedMessages.value.length) {
        userActions.createForwardedMessage({ 
            isReply: (selectedReplyMessage.value.replyToID)? true : false,
            fromUsername: JSON.parse(localStorage.getItem('auth')).username,
            text: messageText.value,
            fromUserID: JSON.parse(localStorage.getItem('auth')).id,
            toUserID: selectedChat.value?.userID,
            replyToID: selectedReplyMessage.value.replyToID,
            replyToContent: selectedReplyMessage.value.replyToContent,
            forwardedMessages: forwardedMessages.value,
            chatID: selectedChat.value.chatID,
        })
    }
    // Принудительная остановка lazyloading
    userWriteMessage.isStop.value = true;
    if(selectedReplyMessage.value.replyToID){
        cancelReplyMessage();
    }
    draftStorageUpdate(selectedChat.value.chatID, 0);
}

// Удаление выбранных собщений
function deleteMessages(isAllUsers){
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    if(isAllUsers === false){
        store.dispatch('deleteMessages', { messagesID: selectedMessages.value, userID: myID, isAllUsers })
            .then(() => {
                store.dispatch('getMessages', { chatID: selectedChat.value.chatID, userID: myID, limit: 15 })
                    .then(response => {
                        messages.value = response.messages;
                        selectedMessages.value = []
                    })
            });
    } else {
        const toUserID = selectedChat.value.userID;
        socket.emit('delete-message', { 
            messagesID: selectedMessages.value, 
            fromUserID: myID,
            toUserID
        })
    }
}

// 
function forwardMessages() {
    isShowChats.value = true;
}

// Сброс массива пересылаемых сообщений
function cancelForwardMessages() {
    isForwardMessages.value = false;
    forwardedMessages.value = [];
    draftStorageUpdate(selectedChat.value.chatID, null, null, 0, 0);
}

const mountedMessages = ref([]);
function mountMessage(messageObj){
    mountedMessages.value.push(messageObj);
}

function unmountMessage(messageObj){
    mountedMessages.value.splice(mountedMessages.value.indexOf(messageObj), 1);
}

onMounted(() => {
    const myUsername = JSON.parse(localStorage.getItem('auth')).username;
    const myID = JSON.parse(localStorage.getItem('auth')).id

    // Получение всех пользователей
    store.dispatch('getAllUsers', (res) => {
        for (const user of res) {
            user.id = (+user.id)
            addUser(user);
        }
    })

    // Обработка нажатия клавиш
    document.onkeydown = function(e) {
        // Ответить на предыдущее сообщение
        if(e.code === 'ArrowUp'){
            selectReplyMessage(messages.value[messages.value.length - 1]);
        }
        // Сбросить выделенные сообщение нажатием ESC
        if(e.code === "Escape"){
            selectedMessages.value = [];
            if(selectedReplyMessage.value.replyToID){
                cancelReplyMessage();
            }
        }
    }

    // Получение чатов
    store.dispatch('getUserChats', { userID: JSON.parse(localStorage.getItem('auth')).id })
        .then((data) => {
            chats.value = data;
            data.forEach(chat => {
                draftStorageUpdate(chat.chatID);
            })
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
    // блок опций для наблюдателя чтения сообщений
    const observerReadMessageOptions = {
        root: document.querySelector('.block-messages'),
        threshold: 0.4,
    }

    // Отслеживание непрочитанных сообщений
    const observerMessages = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if(entry.isIntersecting){
                for (const entryMessage of messages.value) {
                    if(entry.target.id == entryMessage.id){
                        if(entryMessage.isRead === false && entryMessage.toUserID == myID){
                            socket.emit('read-message', {
                                message: entryMessage.id,
                                fromUserID: myID,
                                toUserID: selectedChat.value.userID,
                                chatID: entryMessage.chatID,
                            })
                        }
                    }
                }
            }
        }
    }, observerReadMessageOptions);

    // Передает наблюдателю сообщения чата когда они вмонтированны в документ
    watch(() => mountedMessages.value.length, (newValue) => {
        if(newValue > 0){
            for (const entry of mountedMessages.value) {
                observerMessages.observe(entry.messageDOM)
            }
        }
        else {
            mountedMessages.value = [];
        }
    });

    // Сообщение было прочитано
    socket.on('read-message', (data) => {
        if(selectedChat.value.chatID){
            store.dispatch('getMessages', { chatID: data.chatID, userID: myID, limit: messages.value.length })
                .then(response => {
                    messages.value = response.messages;
                })
        }
    });

    // Получение нового сообщения
    socket.on('send-message', (response) => {
        const myID = JSON.parse(localStorage.getItem('auth')).id
        // Если я получатель - Отображать уведомление о получении сообщения
        if(myID == response.toUserID){
            notifyData.value = { notifyContent: `Получено новое сообщение от ${response.fromUsername}` }
            isShowNotifyNewMessage.value = true;
            setTimeout(() => {
                isShowNotifyNewMessage.value = false;
            }, 2000);
        }
        // Если открыта панель чатов, она должна обновлятся для видимости приходящего сообщения
        if(isShowPanelChats.value){
            store.dispatch('getUserChats', { userID: myID })
                .then((data) => {
                    chats.value = data;
                })
        }
        // Если открыт текущий чат в котором приходит сообщение
        if(selectedChat.value.chatID == response?.message.chatID){
            messages.value.push(response.message);
            if(response.created){
                // Если сообщение первое и чат был создан, то у пользователей обновляется список чатов
                store.dispatch('getUserChats', { userID: myID })
                    .then((data) => {
                        chats.value = data;
                    })
            }
            const blockMessages = document.querySelector('.block-messages');
            setTimeout(() => {
                blockMessages.scroll({
                    top: blockMessages.scrollHeight,
                    behavior: "smooth",
                });
            }, 0)
            messageText.value = '';
        } 
    });

    // Удаление сообщения у всех участников чата
    socket.on('delete-message', () => {
        store.dispatch('getMessages', { chatID: selectedChat.value.chatID, userID: myID, limit: 15 })
            .then(response => {
                messages.value = response.messages;
                selectedMessages.value = [];
            })
    });

    // Показывать, что мне пишет пользователь
    socket.on('write-message', (response) => {
        if(response.isWrite){
            if(selectedChat.value.userID === response.fromUserID){
                userWriteMessage.data.value = `${response.username} печатает...`;
                userWriteMessage.isShow.value = true;
            }
        } else {
            if(selectedChat.value.userID === response.fromUserID){
                userWriteMessage.data.value = '';
                userWriteMessage.isShow.value = false;
            }
        }
    });

    // Отображать другому пользователю, что я печатаю сообщение
    const heartBeat = new LazyLoadingModule.LL_HeartBeat(1500);
    watch(messageText, (newValue) => {
        // запись в черновик
        if(newValue !== '') draftStorageUpdate(selectedChat.value.chatID, messageText.value, null, null, null);
        else draftStorageUpdate(selectedChat.value.chatID, 0);

        heartBeat.payload(newValue, userWriteMessage.isStop.value, (execute) => {
            // Принудительная остановка lazyloading
            if(execute === 0){
                userWriteMessage.isStop.value = false;
            }
            // Начало писанины
            if(execute){
                socket.emit('write-message', { 
                    isWrite: execute, 
                    username: myUsername,
                    fromUserID: myID,
                    toUserID: selectedChat.value.userID
                });
            // Конец писанины
            } else {
                // Сохранение напсианного в черновик

                socket.emit('write-message', { 
                    isWrite: execute, 
                    username: myUsername,
                    fromUserID: myID,
                    toUserID: selectedChat.value.userID
                });
            }
        })

    });

});
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
.user-write-message{
    position: absolute;
    bottom: -20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0, .35);
    border-radius: 20px;
    padding: 1px 10px;
    cursor: default;
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
    font-family: monospace;
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