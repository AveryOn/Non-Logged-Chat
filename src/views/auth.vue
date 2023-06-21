<template>
    <div class="auth">

        <form class="auth__form" @submit.prevent>
            <h1 class="auth__title">Auth</h1>

            <!-- EMAIL -->
            <inputComp 
            class="auth__input" 
            placeholder="email" 
            type="email"
            v-model="authForm.email.value"
            ></inputComp>

            <!-- USERNAME -->
            <inputComp 
            class="auth__input" 
            placeholder="username" 
            type="username"
            v-model="authForm.username.value"
            ></inputComp>

            <!-- PASSWORD -->
            <inputComp 
            class="auth__input" 
            placeholder="password" 
            type="password"
            v-model="authForm.password.value"
            ></inputComp>

            <buttonComp class="auth__btn" @click="createUser">Confirm</buttonComp>
        </form>

    </div>
</template>

<script setup>
import inputComp from '@/components/inputComp.vue';
import buttonComp from '@/components/buttonComp.vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
const store = useStore();

const authForm = {
    email: ref(null),
    username: ref(null),
    password: ref(null),
}

// Создание нового пользователя
function createUser() {
    store.dispatch('createUser', {
        username: authForm.username.value,
        email: authForm.email.value,
        friends: [],
        password: authForm.password.value,
    });
    authForm.email.value = null;
    authForm.username.value = null;
    authForm.password.value = null;
}

</script>

<style scoped>
.auth{
    position: relative;
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
}
.auth__title{
    position: absolute;
    top: 20px;
}
.auth__form{
    position: relative;
    width: 40%;
    height: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(61, 78, 77);
    border-radius: 15px;
    box-shadow: 10px 5px 30px 2px rgba(0,0,0, .5);
}
.auth__input{
    margin: 5px 0;
}
.auth__btn{
    position: absolute;
    bottom: 10px;
    right: 60px;
}
</style>