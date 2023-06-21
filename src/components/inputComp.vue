<template>
    <input 
    class='input' 
    type="text" 
    placeholder="Enter your message" 
    v-model="value">
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
    get(){
        return props.modelValue;
    },
    set(value){
        emit('update:modelValue', value);
    }
})
</script>

<style scoped>
.input{
    outline: rgba(0,0,0,0);
    width: 85%;
    padding: 12px;
    margin: 2px;
    background-color: rgb(46, 53, 53);
    border: 1px solid rgba(0,0,0,0);
    border-radius: 10px;
    margin-right: 10px;
    color: bisque;
    font-size: 1.1em;
}
</style>