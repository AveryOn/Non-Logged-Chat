<template>
    <div class="message-container" :id="props.messageData.id" ref="message">
        <div class="message" :style="messageStyle">
            <span class="dot-not-read" v-show="isReadMessage"></span>
            <!-- BODY -->
            <p class="message__body">
                <slot></slot>
            </p>

            <!-- TIME -->
            <p class="message__time">{{ moment(props.messageData.createdAt).format('HH:mm') }}</p>

        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import moment from 'moment';

const props = defineProps({
    messageData: {
        type: Object,
    }
});

// Отображение индикатора непрочитанного сообщения 
const isReadMessage = computed(() => {
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    if (!props.messageData.isRead && props.messageData.fromUserID == myID) {
        return true;
    } else {
        return false;
    }
});

// Стили позиционирования для сообщения
const messageStyle = computed(() => {
    // Если я отпрвитель
    const myID = JSON.parse(localStorage.getItem('auth')).id;
    if (props.messageData.fromUserID == myID) {
        return {
            visibility: 'visible',
            marginLeft: 'auto'
        }
    }
    else {
        return {
            visibility: 'visible',
            marginRight: 'auto',
            backgroundColor: 'rgb(194, 176, 125)'
        }
    }
})

// Объявления событий монтирования и размонтирования сообщения
const emit = defineEmits(['mountMessage', 'unmountMessage']);
const message = ref(null);

onMounted(() => {
    // Если сообщение монтируется, генерируется событие mountMessage
    emit('mountMessage', {messageDOM: message.value, message: props.messageData});
});

onUnmounted(() => {
    // Если сообщение размонтируется, генерируется событие unmountMessage
    emit('unmountMessage', {messageDOM: message.value, message: props.messageData});
});

</script>

<style scoped>
.message-container {
    display: flex;
    width: 100%;
    height: max-content;
    /* background-color: rgba(0,0,0, .4); */
    padding: 5px 15px;
    margin-top: 1px;
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
    padding: 5px 15px;
    cursor: default;
    z-index: 5;
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