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
            
            <div class="item-chat__draft" v-show="draft.draftEnable">
                <p class="item-chat__draft-title">Draft:</p>

                <p class="item-chat__draft-value" v-if="draft.draftType === 'text'">
                    {{ draft.draftValue }}
                </p>

                <p class="item-chat__draft-value" v-else-if="draft.draftType === 'forward'">
                    {{ draft.draftValue }} forwarded messages
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { draftStorageUpdate } from '@/tools/draftStorage';
const props = defineProps({
    chatData: {
        type: Object,
    },
})
const emit = defineEmits(['selectChat']);
const draft = ref({ 
    draftEnable: false, 
    draftType: 'text', 
    draftValue: null, 
    forwardedCountMsg: 0 
});

function selectChat(){
    emit('selectChat', { 
        chatID: +props.chatData.chatID, 
        username: props.chatData.username, 
        userID: +props.chatData.userID ,
    }, false)
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
    const draftStorage = JSON.parse(localStorage.getItem('draft'))[props.chatData.chatID]
    // Если в черновике только данные о переслаемых сообщениях
    if (
        draftStorage.isForwardMessages === true && 
        draftStorage.forwardedMessages.length && 
        !draftStorage.messageText
    ) {
        draft.value.draftEnable = true;
        draft.value.draftType = 'forward';
        draft.value.draftValue = draftStorage.forwardedMessages.length;
    }
    // Если в черновике только текстовое сообщение
    else if (draftStorage.messageText) {
        draft.value.draftEnable = true;
        draft.value.draftType = 'text';
        draft.value.draftValue = draftStorage.messageText;
    }


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
    flex-direction: column;
    align-items: flex-start;
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
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: hsl(180, 46%, 38%);
    border-radius: 50%;
    width: 15px;
    height: 15px;
}
.item-chat__draft {
    /* border: 1px solid black; */
    display: flex;
    align-items: center;
    width: 90%;
    padding: 5px 10px;
}
.item-chat__draft-title {
    color: rgb(219, 59, 59);
    font-family: sans-serif;
    font-weight: bolder;
    margin-right: 10px;
}
.item-chat__draft-value {
    color: rgb(190, 190, 190);
    font-style: italic;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>