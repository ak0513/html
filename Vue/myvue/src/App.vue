<template>
	<!-- 탭으로 구현 -->
	<tabsT></tabsT>
	<!-- //탭으로 구현 -->
</template>

<script setup>
import { createApp, ref} from 'vue';
import tabsT from './components/tabsT.vue'

const app = createApp({
  setup() {
    const count = ref(0)
    return { count }
  }
})

app.mount('#app')



</script>

<style>
h1, h1 a {margin-top:40px;font-weight:900;color:#191d21;text-decoration-thickness: from-font;}
h2 {font-size:24px;font-weight:900}
h3 {font-size:20px;font-weight:700}
h4 {font-size:18px;font-weight:500}
h2, h3, h4 {margin:30px 0 12px;font-weight:700;}
/* h2 + h3 {margin-top:12px;} */
/* h3 + h4 {margin-top:8px;} */
ol > li + li, ul > li + li{margin-top:4px;}
p {margin-top:1rem;}
.wrapper,
#list-type {height:20px;background-color: antiquewhite;}

hr{margin:48px 0;}
pre {display:block;margin-bottom:1rem;background-color: #f6f6f6;padding:16px 20px;border-radius: 8px;}
code {padding:2px 7px;background-color:#f9f9f9;border-radius:4px;}
h2 code { color:rgb(71, 101, 130);}
</style>
