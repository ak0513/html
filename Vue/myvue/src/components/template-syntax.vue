<template>
	<h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/template-syntax.html" target="_blank">템플릿 문법</a></h1>
	<h2>HTML 출력</h2>
	<p>이중 중괄호는 데이터를 HTML이 아닌 일반 텍스트로 해석합니다. <br>실제 HTML을 출력하려면 v-html 디렉티브을 사용해야 합니다.</p>
	<ol>
		<li>텍스트 보간법: {{ rawHtml }}</li>
		<li>v-html 디렉티브: <span v-html="rawHtml"></span></li>
	</ol>

	<h2>속성 바인딩</h2>
	<h3>단축 문법</h3>
	<ol>
		<li v-bind:id="dynamicId">myDynamicId</li>
		<li :id="dynamicId">단축 문법: id myDynamicId</li>
		<li :class="dynamicId">단축 문법: class myDynamicId</li>
		<li :그외="dynamicId">단축 문법: 그외 myDynamicId</li>
	</ol>

	<h3>불리언(Boolean) 속성</h3>
	<ol>
		<li><button v-bind:disabled="!isButtonDisabled">버튼</button></li>
		<li><button :disabled="isButtonDisabled">버튼</button></li>
	</ol>

	<h3>여러 속성을 동적으로 바인딩</h3>
	<ol>
		<li><div v-bind="objectOfAttrs"></div></li>
		<li><div :="objectOfAttrs"></div></li>
	</ol>

	<h2>JavaScript 표현식 사용</h2>
	<h3>하나의 표현식만 가능</h3>
	<ol>
		<li>{{ number + 1 }}</li>
		<li>{{ ok ? '예' : '아니오' }}</li>
		<li :id="`list-${id}`"></li>
	</ol>
	
	<h3>함수 호출</h3>
	<ol>
		<li>{{ greeting(name) }}</li>
		<li>{{ greeting('안녕하세요') }}</li>
	</ol>

	<h2>디렉티브</h2>
	<ol>
		<li v-if="ok">이제 이것을 볼 수 있습니다.</li>
		<li v-if="no">이제 이것을 볼 수 없습니다.</li>
	</ol>

	<h3>인자</h3>
	<p>일부 디렉티브는 디렉티브 뒤에 콜론(:)으로 표시되는 "인자"를 사용할 수 있습니다.</p>
	<ol>
		<li v-bind:id="dynamicId">myDynamicId</li>
		<li :id="dynamicId">단축 문법: id myDynamicId</li>
	</ol>
	<p>또 다른 예로는 DOM 이벤트를 수신하는 v-on 디렉티브입니다.</p>
	<p>v-on은 단축형으로 @를 대신 사용할 수 있습니다.</p>
	<ol>
		<li><a v-on:click="doSomething">alert</a></li>
		<li><a @click="doSomething">alert</a></li>
	</ol>

	<h3>동적인 인자</h3>
	<ol>
		<li><a v-bind:[attributeName]="url"> 동적인 인자</a></li>
		<li><a :[attributeName]="url"> 동적인 인자</a></li>
		<li><a v-on:[eventName]="doSomething">alert</a></li>
	</ol>

</template>

<script setup>
const name = 'Vue3';

// HTML 출력
const rawHtml = '<i>메시지</i>';

// 속성 바인딩
const dynamicId = 'myDynamicId';
const isButtonDisabled = true;
const objectOfAttrs = {
	id: 'container',
	class: 'wrapper'
};

// JavaScript 표현식 사용
const number = 0;
const ok = true;
const no = false;
const id = 'type';
const greeting = (text) => {
	return text
}

// 디렉티브
const doSomething = () => {
	alert('doSomething')
}
const url = 'https://www.example.com';
const attributeName = 'href';
const eventName = 'click';

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
