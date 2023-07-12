<template>
    <div class="fill-reply-message">
        <p class="fill-reply-message__title">
            Replying to a message 
            <strong :style="{ borderBottom: '1px solid bisque', cursor: 'default' }">
                {{ props.username }}
            </strong>:
        </p>
        <div class="fill-reply-message__items">
            <!-- <p class="fill-reply-message__item">{{ props.username }}</p> -->
            <p class="fill-reply-message__content">{{ props.content }}</p>

        </div>
        <span class="material-symbols-outlined" @click="$emit('cancelReply')">
            close
        </span>

    </div>
</template>

<script setup>
const props = defineProps({
    username: String,
    content: String,

});
defineEmits(['cancelReply']);

</script>

<style scoped>
.material-symbols-outlined {
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48
}
.material-symbols-outlined:hover{
    color: rgb(255, 244, 231);
}
.fill-reply-message {
    position: sticky;
    bottom: 5px;
    right: 0;
    left: 0;
    width: 98%;
    height: max-content;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin: auto 5px 5px 5px;
    padding: 15px 10px;
    background-color: rgba(58, 114, 136, 0);
    backdrop-filter: blur(3px);
    border: 1px solid rgba(50, 97, 112, 0.7);
    border-radius: 10px;
    color: bisque;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    cursor: default;
    z-index: 10;
}
.fill-reply-message__title{
    margin-bottom: 8px;
    font-size: 1.15em;
    font-family: monospace;
}
.fill-reply-message__items{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
}
.fill-reply-message__content{
    width: 100%;
    background-color: rgba(50, 97, 112, 0.7);
    padding: 8px 10px;
    border-radius: 8px;
    margin-bottom: 5px;
    font-size: 1.25em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
}
.fill-reply-message__content:hover{
    background-color: rgba(72, 120, 136, 0.7);
}

</style>