<!-- Модальное окно спрашивающее пользователя удалить сообщения у него или у всех пользователей -->
<template>
    <div class="ask-delete__modal" v-show="show" @click="$emit('close', false)">
        <div class="ask-delete">
            <h2 class="ask-delete__title">Delete message:</h2>
            <button class="ask-delete__btn" @click="$emit('deleteForMe', false)">For me</button>
            <button class="ask-delete__btn" @click="$emit('deleteForEveryone', true)">For everyone</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})
defineEmits(['close']);

</script>

<style scoped>
.ask-delete__modal {
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
.ask-delete {
    position: relative;
    width: 25%;
    height: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(46, 53, 53);
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    border-radius: 15px;
}
.ask-delete__title{
    position: relative;
    top: -10px;
    font-size: 1.6em;
}
.ask-delete__btn {
    align-self: stretch;
    background: rgba(0,0,0,0);
    outline: 1px solid rgba(0,0,0,0);
    border: 1px solid rgba(255, 228, 196, 0.8);
    border-radius: 10px;
    color: bisque;
    margin: 10px 35px;
    padding: 6px 15px;
    font-family: monospace;
    font-size: 1.4em;
    cursor: pointer;
}
.ask-delete__btn:hover{
    background: rgba(71, 71, 71, 0.4);
}
</style>