<template>
	<div id="tab1" role="tabpanel">
		<h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/reactivity-fundamentals.html" target="_blank">반응형 기초</a></h1>
		<h2>반응형 상태 설정</h2>
		<ol>
			<li>{{ state.count }}</li>
			<li><button @click="increment">{{ state.count }}</button></li>
		</ol>

		<h3>DOM 업데이트 타이밍</h3>
		<ol>
			<li>
				<div>Count: {{ count }}</div>
				<button @click="increment2">Increment</button>
				<input ref="inputRef" type="text" placeholder="Focus after count changes" />
			</li>
		</ol>

		<h3>깊은 반응형</h3>
		<ol>
			<li><button @click="updateUser">updateUser</button></li>
			<li><button @click="mutateDeeply">mutateDeeply</button></li>
		</ol>

		<h3>반응형 재정의 vs. 원본</h3>
		<p>reactive()의 반환 값은 원본 객체와 같지 않고 원본 객체를 재정의한 프락시(Proxy)라는 점을 유의하는 것이 중요합니다.</p>
	</div>
</template>

<script setup>
import { ref, reactive, nextTick} from 'vue';

// 반응형 상태 설정
const state = reactive({ // reactive는 객체나 배열 같은 복잡한 데이터 구조에 적합/ref는 단일 원시 값이나 간단한 데이터 구조에 적합
	count: 0 
})
const increment = () => {
	state.count++; // state.count 변경하면 Vue가 이를 감지하고 UI를 업데이트함
};

// DOM 업데이트 타이밍
const count = ref(1); // ref는 단일 원시 값이나 간단한 데이터 구조에 적합/reactive는 객체나 배열 같은 복잡한 데이터 구조에 적합
const inputRef = ref(null);
const increment2 = () => {
	count.value++
	// DOM 업데이트 후에 input에 포커스 설정
	nextTick(() => {
		inputRef.value.focus();
	});
}

// 깊은 반응형
const user = reactive({ // reactive는 객체나 배열 같은 복잡한 데이터 구조에 적합/ref는 단일 원시 값이나 간단한 데이터 구조에 적합
	name: 'John Doe',
	age: 30,
	hobbies: ['Reading', 'Gaming']
});
const updateUser = () => {
	user.name = 'Jane Doe';
	user.age++;
	user.hobbies.push('Traveling');
	console.log(user);
};

const obj = reactive({
	nested: { count: 0 },
	arr: ['foo', 'bar']
});
const mutateDeeply = () => {
	obj.nested.count++
	obj.arr.push('baz');
	console.log(obj)
};

// 반응형 재정의 vs. 원본
const raw = {}
const proxy = reactive(raw)

// 반응형으로 재정의 된 것은 원본과 같지 않습니다.
console.log(proxy === raw) // false
</script>