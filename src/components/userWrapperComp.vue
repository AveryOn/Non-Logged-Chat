<template>
    <div class="panel-users">
        <button class="user-wrapper__btn left" @click="scrollUsersLeft">⇽</button>
        <div class="user-wrapper">
            <itemUserComp
            v-for="user in props.users"
            :user="user"
            :key="user.id"
            @click="$emit('openUserPage', user)"
            ></itemUserComp>
        </div>
        <button class="user-wrapper__btn right" @click="scrollUsersRight">⇾</button>
    </div>
</template>

<script setup>
import itemUserComp from './itemUserComp.vue';
const props = defineProps({
    users: {
        type: Array,
        default: () => []
    },
})

// Скролл списка пользователей вправо
let scrollCount = 0
function scrollUsersRight(){
    scrollCount += 100;
    const users = document.querySelector('.user-wrapper');
    users.scroll({
        left: scrollCount,
        behavior: "smooth",
    });
}
// Скролл списка пользователей влево
function scrollUsersLeft(){
    const users = document.querySelector('.user-wrapper');
    users.scroll({
        left: scrollCount - 100,
        behavior: "smooth",
    });
    if(scrollCount >= 0) scrollCount -= 100
}

</script>

<style scoped>
.panel-users{
    position: relative;
    width: 85%;
    height: max-content;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    margin: 10px;
    /* border: 1px solid bisque; */
}
.user-wrapper{
    width: 80%;
    min-height: 50px;
    height: max-content;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
    background-color: rgb(46, 53, 53);
    border-radius: 10px;
    font-family: monospace;
}

.user-wrapper__btn{
    font-size: 1.9em;
    border: none;
    background-color: rgb(46, 53, 53);
    color: bisque;
    cursor: pointer;
    border-radius: 10px;
    padding: 2px;
}
.user-wrapper__btn.left{
    position: relative;
    margin: 5px;
    /* position: absolute; */
}
.user-wrapper__btn.right{
    position: relative;
    margin: 5px;
    /* position: absolute; */
}
</style>