<template>
	<!-- 클래스와 스타일 바인딩 -->
	<!-- <classStyle></classStyle> -->
	<!--// 클래스와 스타일 바인딩 -->

	<hr>
	
	<!-- 템플릿 문법 -->
	<templateSyntax></templateSyntax>
	<!--// 템플릿 문법 -->

	<hr>

	<!-- 반응형 기초 -->
	<reactivityFundamentals></reactivityFundamentals>
	<!--// 반응형 기초 -->

	<hr>

	<!-- 계산된 속성 -->
	<computedProperties></computedProperties>
	<!--// 계산된 속성 -->

	<hr>

	<!-- 클래스와 스타일 바인딩 -->
	<classStyle></classStyle>
	<!--// 클래스와 스타일 바인딩 -->

</template>

<script setup>
import { createApp, ref} from 'vue';

import templateSyntax from './components/template-syntax.vue'
import reactivityFundamentals from './components/reactivity-fundamentals.vue'
import computedProperties from './components/computed-properties.vue'
import classStyle from './components/class-style.vue'

const app = createApp({
  setup() {
    const count = ref(0)
    return { count }
  }
})

app.mount('#app')



</script>

<style>
h1, h1 a {margin-top:40px;font-weight:900;color:#000;text-decoration-thickness: from-font;}
h2 {font-size:24px;font-weight:900}
h3 {font-size:20px;font-weight:700}
h4 {font-size:18px;font-weight:500}
h2, h3, h4 {margin:30px 0 12px;font-weight:700;}
/* h2 + h3 {margin-top:12px;} */
/* h3 + h4 {margin-top:8px;} */
ol > li + li, ul > li + li{margin-top:4px;}

.wrapper,
#list-type {height:20px;background-color: antiquewhite;}

hr{margin:48px 0;}
pre {display:block;margin-bottom:1rem;background-color: #f6f6f6;padding:16px 20px;border-radius: 8px;}

</style>
