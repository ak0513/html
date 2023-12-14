<template>
    <h1>클래스와 스타일 바인딩</h1>

    <div :class="{ active: isActive }"></div>
    <button @click="toggleClass">클래스 토글</button>

    <div class="static" :class="{ active: isActive, 'text-danger': hasError }">11</div>
</template>

<script setup>
import { ref, computed } from 'vue'


const isActive = ref(true)
const hasError = ref(false)

const toggleClass = () => {
    isActive.value = !isActive.value;
};
</script>

<style scoped>
p { margin-top:10px;}
.active {color:brown}
</style>