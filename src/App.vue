<template>
    <router-view></router-view>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { io } from 'socket.io-client';
const router = useRouter();
const store = useStore();

onBeforeMount(() => {
    const socket = io(store.state.hostServer);
    socket.on("connect_error", (err) => {
        throw new Error('WebSocket: Не удалось подключиться к серверу!');
    });

})

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

::-webkit-scrollbar {
    width: 7px;
    height: 4px;
}

::-webkit-scrollbar-thumb {
    background-color: bisque;
    border-radius: 20px;
}

::-webkit-scrollbar-track-piece {
    background-color: rgba(68, 68, 68, 0.5);
}

body {
    background-color: rgb(61, 78, 77);
    color: bisque;
}
</style>