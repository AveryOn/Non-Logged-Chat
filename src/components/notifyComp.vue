<template>
    <div class="notify">
        {{ props.notifyData?.notifyContent }}
    </div>
</template>

<script setup>
const props = defineProps({
    notifyData: {
        type: Object
    }
})

</script>

<style scoped>
.notify {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3em;
    background-color: rgba(0,0,0, .55);
    padding: 15px;
    z-index: 1000;
}
</style>