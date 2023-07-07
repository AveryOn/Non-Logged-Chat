<template>
    <div 
    class="item-chat" 
    :title="`chatID: ${props.chatData.chatID}, userID: ${props.chatData.userID}`"
    @click="selectChat"
    >
        <p class="item-chat__title">{{ props.chatData?.username }}</p>
        <div class="item-chat__body">
            <p class="item-chat__body-text" :style="(!props.chatData.lastMessage?.text)? {color: 'gray'} : ''">
                {{ computedLastMessage }}
                
            </p>
            <span class="item-chat__not-read" v-show="computedReadableMessage"></span>
            
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
const props = defineProps({
    chatData: {
        type: Object,
    },
})
const emit = defineEmits(['selectChat']);
function selectChat(){
    emit('selectChat', { 
        chatID: +props.chatData.chatID, 
        username: props.chatData.username, 
        userID: +props.chatData.userID ,
    })
}

// Вычисляет текст который будет отображаться в поле последнего сообщения в текущем чате
const computedLastMessage = computed(() => {
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    if(props.chatData.lastMessage?.text){
        if(props.chatData.lastMessage?.fromUserID == myID){
            return `you: ${props.chatData.lastMessage?.text}`;
        }else{
            return `${props.chatData?.username}: ${props.chatData.lastMessage?.text}`;
        }
    } else {
        return `Write a message...`;
    }
})

const computedReadableMessage = computed(() => {
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    if(props.chatData.lastMessage?.fromUserID != myID){
        if(props.chatData.lastMessage && !props.chatData.lastMessage?.isRead){
            return true;
        } else {
            return false;
        }
    }
})

onMounted(() => {

})

</script>

<style scoped>
.item-chat{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 95%;
    min-height: 15%;
    height: max-content;
    background: rgba(57, 70, 70, 0.822);
    border-radius: 10px;
    cursor: pointer;
    font-family: sans-serif;
    color: bisque;
    margin: 3px 0;
}
.item-chat:hover{
    background: rgba(50, 61, 61, 0.822);
}
.item-chat__title {
    width: 95%;
    padding: 5px 0 5px 20px;
    border-bottom: 1px solid bisque;
    font-size: 1.3em;
}
.item-chat__body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 95%;
    padding: 5px 0 5px 10px;
    font-size: 1em;
    text-overflow: ellipsis;
    overflow: hidden;
}
.item-chat__body-text{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 90%;
}
.item-chat__not-read {
    top: 50%;
    right: 0;
    background-color: hsl(180, 46%, 38%);
    border-radius: 50%;
    width: 15px;
    height: 15px;
}
</style>