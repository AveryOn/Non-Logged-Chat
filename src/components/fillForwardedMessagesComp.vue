<template>
    <div class="fill-forwarded-mesages">
        + Forwarded messages: {{ props.forwardedMessagesCount }} pcs
    </div>
</template>

<script setup>
const props = defineProps({
    forwardedMessagesCount: {
        type: Number,
        default: 0,
    }
});
</script>

<style scoped>
.fill-forwarded-mesages {
    position: sticky;
    bottom: 5px;
    right: 0;
    left: 0;
    width: 98%;
    background-color: rgba(50, 112, 99, 0.7);
    color: rgba(238, 231, 222, 0.548);
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
</style>