<template>
    <div 
    class="log" :style="logStyle">
        {{ indexLog+1 }})
        <slot></slot>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
const props = defineProps({
    typeLog: {
        type: String,
        default: 'usual'
    },
    indexLog: {
        type: Number,
        default: 0,
    } 
});

const logStyle = computed(() => {
    if(props.typeLog === 'usual' || props.typeLog === ''){
        return {
            backgroundColor: 'rgb(125, 173, 194)',
            color: 'rgb(79, 83, 85)'
        }
    }else if(props.typeLog === 'error'){
        return {
            backgroundColor: 'rgb(175, 61, 61)',
            color: 'rgb(255, 217, 1)'
        }
    }
});

onMounted(() => {
    // console.log(props.typeLog);
})

</script>

<style scoped>
.log{
    display: flex;
    width: 98%;
    padding: 10px;
    margin: 2px 5px;
    border-radius: 20px;
    background-color: rgb(125, 173, 194);
    color: rgb(79, 83, 85);
    font-family: sans-serif;
    font-weight: bolder;
    font-size: 1.1em;
    cursor: default;
}
</style>