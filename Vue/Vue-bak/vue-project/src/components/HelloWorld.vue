<template>
	<div>
		<h1>텍스트 보간법</h1>
		<div>{{ msg }}</div>
		<div>{{ msg2 }}</div>
		<div>{{ msg3 }}</div>

		<h1>v-html 디렉티브 사용(HTML 출력)</h1>
		<div v-html="msg"></div>

		<h1>v-bind 디렉티브(속성 바인딩)</h1>
		<div v-bind:id="dynamicId">dynamicId</div>
		<h2>단축 문법</h2>
		<div :id="dynamicId">v-bind 제외 가능</div>

		<h2>불리언(Boolean)</h2>
		<button v-bind:disabled="isButtonDisabled">true</button>
		<button :disabled="isButtonDisabled2">false</button>

		<h2>여러 속성인 경우</h2>
		<div v-bind="data">여러 속성인 경우1</div>
		<div v-bind="user">여러 속성인 경우2</div>

		<h1>v-for 디렉티브 사용</h1>
		<h2>예시1</h2>
		<ul>
			<li v-for="(item, index) in webtoons" :key="{index}">
				<a :href="item.link" target="_blank">
					<img :src="item.img" width="100">
					<span>제목: {{ item.name }} {{ index }}</span>
				</a>
				<span v-if="item.isUpdate">N</span>
			</li>
		</ul>

		<h2>예시2</h2>
		<ul>
			<li v-for="(value, key) in user" :key="key">
				{{ key }} : {{ value }}
			</li>
		</ul>

		<h1>JavaScript 표현식 사용 예시</h1>
		<div>{{ number + 1 }}</div>
		<div>{{ ok ? '예' : '아니오' }}</div>
		<div>{{ message.split('').reverse().join('') }}</div>
		<div :class="`list-${id}`"></div>

		<h2>함수 호출</h2>
		<div :title="setId('가나다라')">
			setId 인자값이 타이틀로 적용
		</div>

		<h1>v-if 디렉티브</h1>
		<p v-if="seen">이제 이것을 볼 수 있습니다.</p>

		<h1>v-on</h1>
		<div><a v-on:click="doSomething('하하')">클릭 시 alert 발생</a></div>
		<h2>단축형</h2>
		<div><a @click="toggleSeen()">클릭 시 seen 스위칭</a></div>

		<h1>동적인 인자</h1>
		<div><a v-bind:[attributeName]="url"> ... </a></div>
	
		

		v-if v-else
		<div>
			<div v-if="loginedIn">로그아웃</div>
			<div v-else>로그인</div>
		
			<div v-if="type === 'A'">
				A
			</div>
			<div v-else-if="type === 'B'">
				B
			</div>
			<div v-else-if="type === 'C'">
				C
			</div>
			<div v-else>
				Not A/B/C
			</div>
		</div>
		<div :class="{ active: isActive }">active</div>
	</div>


</template>

<script setup>
import { ref, computed } from 'vue'

const isActive = ref(true)
const hasError = ref(false)

defineProps({
	msg: {
		type: String,
		required: true
	},
	msg2: {
		type: String,
		required: true
	},
	msg3: {
		type: String,
		required: false
	}
})



let dynamicId = 'dynamic'
let isButtonDisabled = true;
let isButtonDisabled2 = false;

let data = {
	id: 'hello',
	class: 'hi',
	name: 'hong',
}

let user = {
	name: 'John',
	age: 30,
	email: 'john@example.com'
}

let number = 0;
let ok = true;
let message = '텍스트가 거꾸로 노출됩니다.'
let id = 1;

let setId = (id) => {
	return id
}


let seen = true;

let doSomething = (msg) => {
	alert(msg)
}

let toggleSeen = () => {
	seen = false;
	console.log(seen)
}

let attributeName = 'href1';
let url = 'http://www.naver.com';






let loginedIn = false;

let type = 'C';

let webtoons = [
	{
		name: "햄스터와 그녀",
		link: "http://webtoon.daum.net/webtoon/view/hamsterandher",
		img: "http://t1.daumcdn.net/webtoon/op/478cdf37f585607982ffa9e35b432e8503be8a54",
		isUpdate: true
	},
	{
		name: "프롬 스타",
		link: "http://webtoon.daum.net/webtoon/view/fromstar",
		img: "http://t1.daumcdn.net/webtoon/op/a7fb953d722c1130bfc18440f7e3ce448ece57a1",
		isUpdate: false
	}
]


</script>


<script>
export default {
	data() {
		return {
			/* webtoons : [
				{
					name: "햄스터와 그녀",
					link: "http://webtoon.daum.net/webtoon/view/hamsterandher",
					img: "http://t1.daumcdn.net/webtoon/op/478cdf37f585607982ffa9e35b432e8503be8a54",
					isUpdate: true
				},
				{
					name: "프롬 스타",
					link: "http://webtoon.daum.net/webtoon/view/fromstar",
					img: "http://t1.daumcdn.net/webtoon/op/a7fb953d722c1130bfc18440f7e3ce448ece57a1",
					isUpdate: true
				},
				{
					name: "위대한 로맨스",
					link: "http://webtoon.daum.net/webtoon/view/greatromance",
					img: "http://t1.daumcdn.net/webtoon/op/a816281cb4df5c50a20ac386fd6e496643d0f085",
					isUpdate: false
				},
				{
					name: "빛나는 손을",
					link: "http://webtoon.daum.net/webtoon/view/Hand",
					img: "http://t1.daumcdn.net/cartoon/5913FCAC0234C50001",
					isUpdate: false
				}
			] */
		};
	},
	methods: {
		increment() {
			this.count++;
		}
  	}
};
</script>