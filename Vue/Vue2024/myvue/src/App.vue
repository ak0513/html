<template>
	<h1>App.vue</h1>
	<h2>{{ name }}</h2>

	<button @click="count++">직접 증가 {{ count }}</button>
	<button @click="increment">함수 증가 {{ count }}</button>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		const name = 'Hello World 03 완료'
		const count = ref(1) // ref를 사용하여 반응형으로 정의

		const increment = () => {
			count.value++; // count.value를 변경하면 Vue가 이를 감지하고 UI를 업데이트함
		};
		
		return {
			name,
			count,
			increment
		}
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
