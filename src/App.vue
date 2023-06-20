<template>
    <div class="main">

<!-- CHAT -->
        <div class="chat">
            <span class="panel-chats__open" @click="isShowPanelChats = true"></span>
            <div class="panel-chats" v-show="isShowPanelChats">
                <span class="panel-chats__close" @click="isShowPanelChats = false"></span>
                <itemChatComp></itemChatComp>
            </div>
            <div class="block-messages"></div>
            <div class="panel-input">
                <inputComp v-model="messageText"></inputComp>
                <buttonComp>Send</buttonComp>
            </div>
        </div>

<!-- LOGGER -->
        <div class="logger">
            <h2 class="logger__title">Logger</h2>
            <div class="logger__panel-logs">
                <logComp 
                v-for="(log, index) in logs" 
                :index-log="index"
                :type-log="log.typeLog"
                >
                    {{ log.message }}
                </logComp>
            </div>
        </div>

    </div>
</template>

<script setup>
import inputComp from '@/components/inputComp.vue';
import buttonComp from '@/components/buttonComp.vue';
import itemChatComp from '@/components/itemChatComp.vue';
import logComp from '@/components/logComp.vue';
import { ref, watch, onMounted } from 'vue';

const isShowPanelChats = ref(false);
const messageText = ref('');
const logs = ref([
    {typeLog: 'error', message: 'Hello something text!'},
    {typeLog: 'usual', message: 'Hello someta123hing text!'},
])

// function addLog(){
//     logs.value.push({typeLog: 'usual', message: 'Hello someta123hing text!'})
// }

onMounted(() => {
    const panelLogs = document.querySelector('.logger__panel-logs');
    watch(logs.value, (newValue) => {
        setTimeout(() => {
            panelLogs.scroll({
                top: panelLogs.scrollHeight,
                behavior: "smooth",
            });
        }, 10)
    })

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
    color: rgb(255, 197, 38);
}
.main{
    display: flex;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0);
}
.chat{
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 20px;
    top: 20px;
    bottom: 20px;
    display: flex;
    width: 70%;
    border-radius: 10px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    border: 1px solid rgb(54, 54, 54);
    overflow: hidden;
}
.panel-chats{
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 0;
    background: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    z-index: 100;
}
.panel-chats__close{
    position: absolute;
    right: -25px;
    top: 10px;
    width: 20px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgb(189, 75, 75);
    background-color: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    cursor: pointer;
}
.panel-chats__close:hover{
    background-color: rgb(189, 75, 75, .3);
}
.panel-chats__open{
    position: absolute;
    left: 4px;
    top: 10px;
    position: absolute;
    width: 20px;
    height: 40px;
    border-radius: 20px;
    border: 1px solid rgb(98, 140, 204);
    background-color: rgba(0,0,0, .3);
    backdrop-filter: blur(4px);
    cursor: pointer;
}
.panel-chats__open:hover{
    background-color: rgba(86, 118, 167, 0.3);
}
.block-messages{
    position: relative;
    width: 95%;
    height: 86%;
    background-color: rgb(46, 53, 53);
    border-radius: 10px;
    margin: 10px auto 10px auto;

}
.panel-input{
    position: relative;
    width: 95%;
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: rgb(49, 59, 59); */
    border-radius: 10px;
    margin: 5px auto 10px auto;
}
.logger{
    position: absolute;
    width: 25%;
    right: 20px;
    top: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgb(54, 54, 54);
    border-radius: 10px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
}
.logger__title{
    font-size: 2em;
    font-family: sans-serif;
    color: bisque;
    border-bottom: 2px solid bisque;
    margin: 10px;
    cursor: default;
}
.logger__panel-logs{
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(46, 53, 53);
    width: 92%;
    border-radius: 10px;
    height: 90%;
    overflow-x: hidden;
    overflow-y: auto;
}
</style>