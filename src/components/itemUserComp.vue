<template>
    <span 
    class="item-user" 
    :style="{ backgroundColor: user.color }" 
    :title="user?.username"
    >
        <span class="indicator" v-show="isActiveUser"></span>
        <p class="user-title">
            {{ props.user.username.split('')[0].toUpperCase() }}
        </p>
    </span>
</template>

<script setup>
import { computed, watch} from 'vue';
import { useStore } from 'vuex';
const store = useStore();
console.log();
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Object
    },
})

const isActiveUser = computed(() => {
    if(store.state.activeUsers.includes(props.user.id)){
        return true;
    }else{
        return false;
    }
})

watch(store.state.activeUsers, (newValue) => {
    console.log(newValue);
})

</script>

<style scoped>
.item-user{
    position: relative;
    min-width: 50px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: bisque;
    border-radius: 50%;
    margin: 2px;
}
.user-title{
    font-size: 2em;
    cursor: pointer;
}
.indicator{
    position: absolute;
    left: 2px;
    top: 2px;
    width: 10px;
    height: 10px;
    background-color: rgb(51, 124, 51);
    border-radius: 50%;
}
</style>