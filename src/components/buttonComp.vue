<template>
    <button class="btn">
        <slot></slot>
    </button>
</template>

<script setup>

</script>

<style scoped>
.btn{
    outline: rgba(0,0,0,0);
    border: 1px solid rgba(0,0,0,0);
    background-color: rgb(46, 53, 53);
    padding: 12px;
    color: bisque;
    font-size: 1.1em;
    border-radius: 10px;
    cursor: pointer;
}
</style>