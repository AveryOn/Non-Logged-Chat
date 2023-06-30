<template>
    <div class="user-page" v-show="props.show" @click="$emit('closeUserPage')">
        
        <div class="user-page__data-block" @click.stop>

            <p class="active-user-text">{{ (isUserActive)? 'online' : 'offline' }}</p>

            <div class="user-icon" :style="{'backgroundColor': props.userData.color}">
                <span class="user-page__indicator" v-show="isUserActive"></span>
                {{ (props.userData.username)?.split('')[0]?.toUpperCase() }}
            </div>

            <p class="user-option">{{ props.userData?.username }}</p>
            <p class="user-option">Friends: {{ props.userData?.friends.length }}</p>

            <buttonComp class="user-btn">Add as a friend</buttonComp>
            <buttonComp 
            class="user-btn" 
            @click="$emit('selectChat', { titleChat: props.userData.username, bodyChat: ' ' })"
            >
                Write message
            </buttonComp>

        </div>
    
    </div>
</template>

<script setup>
import buttonComp from './buttonComp.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
const store = useStore();
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    userData: {
        type: Object,
    }
}) 

const isUserActive = computed(() => {
    if(store.state.activeUsers.includes(props.userData.id)){
        return true;
    }else{
        return false;
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
.active-user-text{
    position: absolute;
    right: 10px;
    top: 5px;
    font-family: sans-serif;
    cursor: default;
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
.user-page__indicator{
    position: absolute;
    left: 15px;
    top: 15px;
    width: 18px;
    height: 18px;
    background-color: rgb(51, 124, 51);
    border: 1px solid rgb(47, 83, 47);
    border-radius: 50%;
}
.user-option{
    font-size: 1.4em;
    margin: 20px 10px 10px 10px;
    font-family: sans-serif;
}
.user-btn{
    /* position: relative;
    bottom: 20px; */
    margin: 5px;
}
</style>