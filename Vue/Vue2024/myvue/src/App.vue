<template>
	<h1>{{ name }}</h1>

	<h2>함수 실행</h2>
	<p>변수로 받기 {{ greeting(name) }}</p>
	<p>스트링으로 받기 {{ greeting('Hellow Vue') }}</p>

	<h2>ref & reactive</h2>
	<h3>ref</h3>
	<p>{{ greeting(name2) }}</p>
	<p>{{ name4 }}</p>
	<button class="btn btn-primary" v-on:click="updateName2">ref name2 변경</button>

	<h3>reactive</h3>
	<p>{{ greeting(name3) }}</p>
	<button class="btn btn-primary" @click="updatename3">reactive id 변경</button>


	
	<div>
		<button class="btn btn-primary" @click="count++">직접 증가 {{ count }}</button>
		<button class="btn btn-primary" @click="increment">함수 증가 {{ count }}</button>
	</div>
</template>

<script>
import { ref } from 'vue';
import { reactive } from 'vue';

export default {
	setup() {
		const name = 'Hello World';
		// ref & reactive 반응형
		const name2 = ref('Hello World'); // ref를 사용하여 반응형으로 정의
		let name3 = reactive(1); // reactive는 숫자나 스트링은 사용하지 못함
		const name4 = ref({id:1});

		const greeting = (text) => {
			return text
		}

		const count = ref(1)
		const increment = () => {
			count.value++; // count.value를 변경하면 Vue가 이를 감지하고 UI를 업데이트함
		};

		const updateName2 = () => {
			name2.value = 'Hello World2'
			name4.value.id = 3
		}

		const updatename3 = () => {
			name3 = 2
		}

		
		
		return {
			name,
			name2,
			name3,
			name4,
			count,
			increment,
			greeting,
			updateName2,
			updatename3
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
h1 {margin-top:40px;}
h2 {font-size:24px;}
h3 {font-size:18px;}
h2,h3 {margin:30px 0 12px;font-weight:700;}
h2 + h3 {margin-top:12px;}
p {margin:12px 0;}
</style>
