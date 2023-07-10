<template>
    <div 
    class="message-container"
    :style="messageContainerStyle"
    :id="props.messageData.id" 
    ref="message"
    :title="`${props.messageData.id} - ${props.messageData.isRead}`"
    @click.self="selectMessage"
    >
        <div class="message" :style="messageStyle">
            <div 
            class="message__reply-to" 
            v-show="(props.messageData.replyToID)? true : false"
            >
                <p class="message__reply-to-title">Replying to a message:</p>
                <p class="message__reply-to-content" @click="$emit('findMessage', props.messageData.replyToID)">
                    <strong>
                        {{ props.messageData.replyToContent }}
                    </strong>
                </p>
            </div>
            <span class="dot-not-read" v-show="isReadMessage"></span>
            <!-- BODY -->
            <p class="message__body">
                <slot></slot>
            </p>
            
            <!-- TIME -->
            <p class="message__time">{{ moment(props.messageData.createdAt).format('HH:mm') }}</p>
            <!-- Значок для ответа на сообщение -->
            <span 
            class="reply-btn" 
            :style="(isShowReply)? replyBtnStyle : {}"
            @click="$emit('reply', props.messageData)"
            >
                <span class="material-symbols-outlined">
                    reply
                </span>
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import moment from 'moment';
const props = defineProps({
    messageData: {
        type: Object,
    },
    isResetSelection: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['mountMessage', 'unmountMessage', 'isSelect', 'reply', 'findMessage']);

const isShowReply = ref(false);
const isSelectMessage = ref(false);
const message = ref(null);
const myID = JSON.parse(localStorage.getItem('auth')).id;

function selectMessage(){
    isSelectMessage.value = !isSelectMessage.value;
    if(isSelectMessage.value){
        emit('isSelect', props.messageData.id, true);
    } else {
        emit('isSelect', props.messageData.id, false);
    }
}

// Если нажата кл. ESC -> сброс всех выделенных сообщений
watch(() => props.isResetSelection, (newValue) => {
    if(newValue){
        isSelectMessage.value = false;
    }
})

// Отображение индикатора непрочитанного сообщения 
const isReadMessage = computed(() => {
    if (!props.messageData.isRead && props.messageData.fromUserID == myID) {
        return true;
    } else {
        return false;
    }
});

// Стили контейнера сообщения
const messageContainerStyle = computed(() => {
    if(isSelectMessage.value){
        return { 
            backgroundColor: 'rgba(0,0,0, .07)' 
        }
    }
    else if(props.messageData?.isFindMessage){
        return { 
            backgroundColor: 'rgba(255, 192, 55, 0.07)'
        }
    }
})

// Стили позиционирования для сообщения
const messageStyle = computed(() => {
    const resultStyle = {};
    if(isShowReply.value){
        resultStyle.marginRight = '30px'
    }
    // Если я отпрвитель
    if (props.messageData.fromUserID == myID) {
        resultStyle.visibility = 'visible';
        resultStyle.marginLeft = 'auto';
        return resultStyle;
    }
    else {
        resultStyle.visibility = 'visible';
        resultStyle.marginRight = 'auto';
        resultStyle.backgroundColor = 'rgb(194, 176, 125)';
        return resultStyle;
    }
})

// Стили кнопки ответа на сообщение
const replyBtnStyle = computed(() => {
    // Если я отпрвитель
    if(props.messageData.fromUserID == myID){
        return {
            visibility: 'visible',
            color: 'rgb(125, 173, 194)'
        }
    }
    else {
        return {
            visibility: 'visible',
            color: 'rgb(194, 176, 125)'
        }
    }
})

onMounted(() => {
    // Если сообщение монтируется, генерируется событие mountMessage
    emit('mountMessage', { messageDOM: message.value, message: props.messageData });

    const messageContainer = document.getElementById(props.messageData.id);
    messageContainer.addEventListener('mouseover', () => {
        isShowReply.value = true;
    })
    messageContainer.addEventListener('mouseout', () => {
        isShowReply.value = false;
    })

});

onUnmounted(() => {
    // Если сообщение размонтируется, генерируется событие unmountMessage
    emit('unmountMessage', { messageDOM: message.value, message: props.messageData });
});

</script>

<style scoped>
.material-symbols-outlined {
    scale: 0.7;
    font-variation-settings:
    'FILL' 0,
    'wght' 800,
    'GRAD' ,
    'opsz' 48
}
.message-container {
    display: flex;
    align-items: center;
    width: 100%;
    height: max-content;
    /* background-color: rgba(0,0,0, .4); */
    padding: 5px 15px;
    margin-top: 1px;
}
.message-container:hover {
    cursor: pointer;
}
.message {
    position: relative;
    visibility: hidden;
    min-width: 30px;
    width: max-content;
    max-width: 45%;
    background-color: rgb(125, 173, 194);
    color: rgb(51, 56, 58);
    font-family: sans-serif;
    word-wrap: break-word;
    border-radius: 10px;
    padding: 5px 18px;
    cursor: default;
    z-index: 5;
}
.message__reply-to{
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    margin: -2px -12px 5px -12px;
    border-radius: 8px;
    padding: 4px
}
.message__reply-to-title{
    font-family: monospace;
    font-size: 1.25em;
    color: rgba(255, 255, 255, 0.5);
}
.message__reply-to-content{
    color: rgb(159, 213, 231);
    padding: 5px 10px;
    margin: 5px 2px;
    border-radius: 8px;
    box-shadow: 1px 1px 3px 1px rgba(0,0,0, .5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.message__reply-to-content:hover{
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    cursor: pointer;
}
.reply-btn{
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    right: -30px;
    bottom: 0;
    color: rgb(125, 173, 194);
    border-radius: 50%;
    padding: 2px;
}
.reply-btn:hover{
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.dot-not-read {
    position: absolute;
    bottom: 5px;
    left: -12px;
    background-color: rgb(125, 173, 194);
    border-radius: 50%;
    width: 8px;
    height: 8px;

}

.message__body {
    margin-bottom: 12px;
}

.message__time {
    position: absolute;
    bottom: 0;
    right: 0;
    scale: 0.75;
}
</style>