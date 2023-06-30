<template>
    <div class="my-icon" :style="{backgroundColor: color}" :title="myData">
        {{ title }}
    </div>
</template>

<script setup>
import { ref } from 'vue';

const color = ref(localStorage.getItem('my-color'));
const title = ref(JSON.parse(localStorage.getItem('auth')).username.split('')[0].toUpperCase())
const myData = ref(JSON.parse(localStorage.getItem('auth')).username)

</script>

<style scoped>
.my-icon{
    position: fixed;
    width: 70px;
    height: 70px;
    right: 20px;
    bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: bisque;
    border-radius: 50%;
    z-index: 100000;
    font-size: 3.5em;
    font-family: sans-serif;
    font-weight: bolder;
    cursor: default;
}

</style>