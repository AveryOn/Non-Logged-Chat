<template>
    <div class="item-chat">
        <p class="item-chat__title">{{ titleChat }}</p>
        <p class="item-chat__body">{{ bodyChat }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
    titleChat: {
        type: String,
        default: 'undefined'
    },
    bodyChat: {
        type: String,
        default: 'undefined'
    },
})

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