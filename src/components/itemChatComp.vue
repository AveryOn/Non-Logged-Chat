<template>
    <div 
    class="item-chat" 
    :title="`chatID: ${props.chatData.chatID}, userID: ${props.chatData.userID}`"
    @click="selectChat"
    >
        <p class="item-chat__title">{{ props.chatData?.username }}</p>
        <p class="item-chat__body"></p>
    </div>
</template>

<script setup>
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

</script>

<style scoped>
.item-chat{
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
.item-chat__title{
    width: 95%;
    padding: 5px 0 5px 20px;
    border-bottom: 1px solid bisque;
    font-size: 1.3em;
}
.item-chat__body{
    width: 95%;
    padding: 5px 0 5px 10px;
    font-size: 1em;
}
</style>