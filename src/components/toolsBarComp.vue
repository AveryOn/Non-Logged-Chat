<template>
    <div class="tools-bar" v-show="props.show">
        <button class="tools-bar__btn" @click="$emit('deleteMessages')">Delete</button>
    </div>
</template>


<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

</script>

<style scoped>
.tools-bar {
    position: absolute;
    top: 5%;
    right: 5%;
    left: 5%;
    height: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0, .13);
    border: 1px solid rgba(128, 128, 128, 0.3);
    backdrop-filter: blur(1.5px);
    border-radius: 10px;
    z-index: 100;
}
.tools-bar__btn{
    background-color: rgb(85, 87, 87);
    color: rgb(125, 173, 194);
    margin: 5px;
    padding: 5px 10px;
    border: rgba(0,0,0,0);
    border-radius: 10px;
    cursor: pointer;
}
.tools-bar__btn:hover{
    background-color: rgb(100, 100, 100);
}
</style>