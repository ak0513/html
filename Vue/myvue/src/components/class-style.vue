<template>
    <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/class-and-style.html#binding-html-classes" target="_blank">클래스와 스타일</a></h1>
    <h2>HTML 클래스 바인딩</h2>
    <h3>객체로 바인딩 하기</h3>
	<div :class="{ active: isActive }">:class="{ active: isActive }"</div>
    <div class="static" :class="{ active: isActive, 'text-danger': hasError }">:class="{ active: isActive, 'text-danger': hasError }</div>
    <div class="static" :class="{ active: isActive, 'text-danger': isActive }">:class="{ active: isActive, 'text-danger': isActive }"</div>
    <div :class="classObject">classObject</div>
    <div :class="classObject2">classObject2</div>

    <h3>배열로 바인딩 하기</h3>
    <div :class="[activeClass, errorClass]">[activeClass, errorClass]</div>


</template>

<script setup>
import {ref, reactive, computed} from 'vue';

const isActive = ref(true)
const hasError = ref(false)

const classObject = reactive({
    active: true,
    'text-danger': false
})

const error = ref(null)

const classObject2 = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
}))


const activeClass = ref('active')
const errorClass = ref('text-danger')
</script>