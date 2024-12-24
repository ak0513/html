<template>
    <div id="tab5" role="tabpanel">
    <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/conditional.html" target="_blank">조건부 렌더링</a></h1>
    <h2><code>v-if</code></h2>
<pre>
const awesome = ref(true)
&lt;div v-if="awesome"&gt;Vue는 정말 멋지죠!&lt;/div&gt;

결과 : &lt;div&gt;Vue는 정말 멋지죠!&lt;/div&gt;
</pre>
<div v-if="awesome">Vue는 정말 멋지죠!</div>


    <h2><code>v-else</code></h2>
<pre>
const awesome = ref(true)

&lt;p v-if="awesome"&gt;Vue는 정말 멋지죠!&lt;/p&gt;
&lt;p v-else&gt;아닌가요?&lt;/p&gt;
&lt;button @click="awesome = !awesome"&gt;전환&lt;/button&gt;

결과는 아래
</pre>
<div>
    <p v-if=awesome>Vue는 정말 멋지죠!</p>
    <p v-else>아닌가요? 😢</p>
    <button @click="awesome = !awesome">전환</button>
</div>


    <h2><code>v-else-if</code></h2>
<pre>
const type = ref('C');

&lt;div v-if="type === 'A'"&gt;A&lt;/div&gt;
&lt;div v-else-if="type === 'B'"&gt;B&lt;/div&gt;
&lt;div v-else-if="type === 'C'"&gt;C&lt;/div&gt;
&lt;div v-else&gt;A도 B도 C도 아님&lt;/div&gt;

결과 : &lt;div&gt;C&lt;/div&gt;
</pre>

<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>A/B/C 아님</div>


    <h2><code>v-show</code></h2>
    <p>엘리먼트를 조건부로 표시하는 다른 옵션은 v-show 디렉티브입니다.<br>사용법은 대체로 동일합니다.</p>
<pre>
const ok = ref(true)

const toggle = () => {
    ok.value = !ok.value
}

&lt;p v-show="ok"&gt;안녕!&lt;/p&gt;
&lt;button @click="toggle"&gt;텍스트&lt;/button&gt;

결과는 아래
</pre>
<p v-show="ok">안녕!</p>
<button @click="toggle">버튼</button>


    <h2><code>v-if</code> vs <code>v-show</code></h2>
    <p><code>v-if</code>는 "실제" 조건부 렌더링입니다. 왜냐하면 조건부 블록이 전환될 경우, 블록 내 이벤트 리스너와 자식 컴포넌트가 제대로 제거되거나 재생성되기 때문입니다.</p>
    <p>또한 <code>v-if</code>는 <strong>게으르므로</strong>(lazy), 초기 조건이 false면 아무 작업도 수행하지 않습니다. 조건부 블록은 조건이 true가 될 때까지 렌더링되지 않습니다.</p>
    <p>이에 비해 <code>v-show</code>는 훨씬 간단합니다. 엘리먼트는 CSS 기반으로 전환 되므로, 초기 조건과 관계없이 항상 렌더링 됩니다.</p>
    <p>
        일반적으로 <code>v-if</code>는 전환 비용이 더 높고, <code>v-show</code>는 초기 렌더링 비용이 더 높습니다.<br>
        <b>따라서 매우 자주 전환해야 하는 경우 <code>v-show</code>를, 실행 중에 조건이 변경되지 않는 경우 <code>v-if</code>를 사용하는 것이 좋습니다.</b>
    </p>

    <h2><code>v-if</code> with <code>v-for</code></h2>
    <p><code>v-if</code>와 <code>v-for</code>를 함께 사용하는 것은 <strong>권장되지 않습니다</strong>. [<a href="https://v3-docs.vuejs-korea.org/guide/essentials/list.html#v-for-with-v-if" target="_blank">이유</a>]</p>
    <hr>
<pre>
&lt;div&gt;텍스트&lt;/div&gt;
</pre>
    </div>
</template>

<script setup>
import {ref} from 'vue';
const awesome = ref(true);
const type = ref('C');
const ok = ref(true)

const toggle = () => {
    ok.value = !ok.value
}

// console.log(ok)
</script>