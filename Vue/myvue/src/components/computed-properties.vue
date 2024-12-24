<template>
	<div id="tab3" role="tabpanel">
    <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/computed.html" target="_blank">계산된 속성</a></h1>
	<h2>기본 예제</h2>
	<ol>
		<li>책을 가지고 있다:</li>
		<li>{{ author.books.length > 3 ? 'Yes ' + author.name : 'No ' + author.name }}</li>
		<li>{{ publishedBooksMessage }}</li>
		<li>{{ publishedBooksMessage2() }}</li>
		<li><button @click="publishedBooksMessagePush">publishedBooksMessagePush</button></li>
		<li><button @click="publishedBooksMessageChange">publishedBooksMessageChange</button></li>
	</ol>

	<h2>수정 가능한 계산된 속성</h2>
	<ol>
		<li>{{ fullName }}</li>
	</ol>
	</div>
</template>

<script setup>
import { ref, reactive, computed} from 'vue';

// 계산된 속성
const author = reactive({
	name: 'John Doe',
	books: [
		'Vue 2 - Advanced Guide',
		'Vue 3 - Basic Guide',
		'Vue 4 - The Mystery'
	]
});

// 계산된 ref
const publishedBooksMessage = computed(() => { // computed 속성은 Vue가 자동으로 캐싱하여 관리하며, 상태가 변경될 때마다 자동으로 최신 값을 유지하고, 상태가 변경되지 않는 한 재계산을 하지 않기 때문에 성능 면에서 이점이 있다.
	return author.books.length > 3 ? 'Yes ' + author.name : 'No ' + author.name;
})
const publishedBooksMessage2 = () => { // 호출 될 때마다 계산하므로 비효율적
	return author.books.length > 3 ? 'Yes ' + author.name : 'No ' + author.name;
}
const publishedBooksMessagePush = () => {
	author.books.push('Vue 5');
};
const publishedBooksMessageChange = () => {
	author.name = 'Tommy Doe'
}

// 수정 가능한 계산된 속성
const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed({
	// getter
	get() {
		return firstName.value + ' ' + lastName.value
	},
	// setter
	set() {
		// 참고: 분해 할당 문법을 사용함.
		firstName.value, lastName.value
	}
})
</script>