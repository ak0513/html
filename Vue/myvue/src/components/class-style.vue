<template>
    <h1>반응형 기초</h1>
    <h2>HTML 클래스 바인딩</h2>
	<div :class="{ active: isActive }">active: isActive</div>

</template>

<script setup>
import {ref} from 'vue';

const isActive = ref(true)
// const hasError = ref(false)
</script>