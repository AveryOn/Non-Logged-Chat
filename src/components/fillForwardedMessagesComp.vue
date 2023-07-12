<template>
    <div class="fill-forwarded-mesages">
        <p class="fill-forwarded-mesages__content">
            {{ props.forwardedMessagesCount }} forwarded messages..
        </p>
        <span class="material-symbols-outlined" @click="$emit('cancelForward')">
            close
        </span>
    </div>

</template>

<script setup>
const props = defineProps({
    forwardedMessagesCount: {
        type: Number,
        default: 0,
    }
});
defineEmits(['cancelForward']);

</script>

<style scoped>
.material-symbols-outlined {
    position: relative;
    cursor: pointer;
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48
}
.material-symbols-outlined:hover {
    color: rgba(238, 231, 222, 0.918);
} 
.fill-forwarded-mesages {
    position: sticky;
    bottom: 5px;
    right: 0;
    left: 0;
    width: 98%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(50, 112, 99, 0.7);
    color: rgba(238, 231, 222, 0.6);
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    font-family: cursive;
    padding: 8px 10px;
    border-radius: 8px;
    margin: auto 5px 5px 5px;
    font-size: 1.17em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    z-index: 10;
}
.fill-forwarded-mesages__content{
    font-style: italic;
}
</style>