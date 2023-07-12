<!-- Модальное окно спрашивающее пользователя удалить сообщения у него или у всех пользователей -->
<template>
    <div class="ask-froward-chat__modal" v-show="show" @click="$emit('close', false)">
        <div class="ask-froward-chat" @click.stop>
            <p class="ask-froward-chat__title">Select chat</p>
            <itemChatComp 
            v-for="chat in props.chats"
            v-if="show"
            :chat-data="chat"
            @select-chat="selectChat"
            ></itemChatComp>
        </div>
    </div>
</template>

<script setup>
import itemChatComp from '@/components/itemChatComp.vue';
const props = defineProps({
    chats: {
        type: Array,
        default: () => [],
    },
    show: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['close', 'selectChat']);

function selectChat(chat){
    emit('selectChat', chat, true);
    emit('close', false);
}

</script>

<style scoped>
.ask-froward-chat__modal {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0, .4);
    z-index: 9999999;
}
.ask-froward-chat {
    position: relative;
    width: 35%;
    min-height: 25%;
    max-height: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 0 25px 0;
    background-color: rgb(46, 53, 53);
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    border-radius: 15px;
}
.ask-froward-chat__title{
    position: relative;
    margin-bottom: 10px;
    font-size: 1.6em;
}
</style>