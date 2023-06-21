<template>
    <div class="user-page" v-show="props.show" @click="$emit('closeUserPage')">
        
        <div class="user-page__data-block" @click.stop>
            <div class="user-icon" :style="{backgroundColor: props.userData.color}">
                {{ (props.userData.username)?.split('')[0]?.toUpperCase() }}
            </div>
            <p class="user-option">{{ props.userData?.username }}</p>
            <p class="user-option">Friends: {{ props.userData?.friends.length }}</p>
            <buttonComp class="user-btn" @click="createChat">Write message</buttonComp>
        </div>
    
    </div>
</template>

<script setup>
import buttonComp from './buttonComp.vue';
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    userData: {
        type: Object,
    }
}) 

function createChat(){
    
}

</script>

<style scoped>
.user-page{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0, .5);
    z-index: 10000;
}
.user-page__data-block{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 25%;
    height: 60%;
    background-color: rgb(61, 78, 77);
    border-radius: 10px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
    padding: 15px 0;
}
.user-icon{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: bisque;
    font-size: 5em;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.user-option{
    font-size: 1.4em;
    margin: 20px 10px 10px 10px;
    font-family: sans-serif;
}
.user-btn{
    position: absolute;
    bottom: 20px;
}
</style>