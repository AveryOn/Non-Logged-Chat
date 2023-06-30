<template>
    <div class="message-container">
        <div 
        class="message"
        :style="messageStyle"
        >
            <!-- BODY -->
            <p class="message__body">
                <slot></slot>
            </p>

            <!-- TIME -->
            <p class="message__time">{{ props.messageData.createdAt }}</p>

        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const props = defineProps({
    messageData: {
        type: Object,
    }
});

// Стили позиционирования для сообщения
const messageStyle = computed(() => {
    // Если я отпрвитель
    if(props.messageData.fromUserID === store.state.myID) {
        return {
            visibility: 'visible',
            marginLeft: 'auto'
        }
    }
    else{
        return {
            visibility: 'visible',
            marginRight: 'auto',
            backgroundColor: 'rgb(194, 176, 125)'
        }
    }
})

</script>

<style scoped>
.message-container{
    display: flex;
    width: 100%;
    height: max-content;
    /* background-color: rgba(0,0,0, .4); */
    margin-top: 1px;
    padding: 5px 15px;
}
.message{
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
.message__body{
    margin-bottom: 12px;
}
.message__time{
    position: absolute;
    bottom: 0;
    right: 0;
    scale: 0.75;
}
</style>