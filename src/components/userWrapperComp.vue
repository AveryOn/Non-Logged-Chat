<template>
    <div class="if-none-chats__users">
        <span 
        class="if-none-chats__user-item" 
        :style="{ backgroundColor: user.color }" 
        v-for="user in users"
        :title="user?.username"
        :key="user.id"
        @click="$emit('openUserPage', user)"
        >
            <p class="user-word">
                {{ user.username.split('')[0].toUpperCase() }}
            </p>
        </span>
        <button class="if-none-chats__btn left" @click="scrollUsersLeft">⇽</button>
        <button class="if-none-chats__btn right" @click="scrollUsersRight">⇾</button>
    </div>
</template>

<script setup>
const props = defineProps({
    users: {
        type: Array,
        default: () => []
    }
})

// Скролл списка пользователей вправо
let scrollCount = 0
function scrollUsersRight(){
    scrollCount += 100;
    const users = document.querySelector('.if-none-chats__users');
    users.scroll({
        left: scrollCount,
        behavior: "smooth",
    });
}
// Скролл списка пользователей влево
function scrollUsersLeft(){
    const users = document.querySelector('.if-none-chats__users');
    users.scroll({
        left: scrollCount - 100,
        behavior: "smooth",
    });
    if(scrollCount >= 0) scrollCount -= 100
}

</script>

<style scoped>
.if-none-chats__users{
    width: 300px;
    min-height: 50px;
    height: max-content;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    align-items: center;
    background-color: rgb(46, 53, 53);
    border-radius: 10px;
    margin-bottom: 30px;
}
.if-none-chats__user-item{
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: bisque;
    border-radius: 50%;
    margin: 2px;
}
.user-word{
    font-size: 2em;
    cursor: pointer;
}
.if-none-chats__btn{
    font-size: 1.9em;
    border: none;
    background-color: rgb(46, 53, 53);
    color: bisque;
    cursor: pointer;
    border-radius: 10px;
    padding: 2px;
}
.if-none-chats__btn.left{
    position: absolute;
    left: -35px;
}
.if-none-chats__btn.right{
    position: absolute;
    right: -35px;
}
</style>