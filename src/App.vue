<template>
    <router-view></router-view>
</template>

<script setup>
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
    // store.dispatch('createChat', { firstUserID: 1687383806267, secondUserID: 1687383789283 });
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
    font-family: monospace;
}
</style>