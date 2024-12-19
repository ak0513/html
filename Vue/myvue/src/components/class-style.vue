<template>
    <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/class-and-style.html#binding-html-classes" target="_blank">클래스와 스타일</a></h1>
    <h2>HTML 클래스 바인딩</h2>
    <h3>객체로 바인딩 하기</h3>
	<pre :class="{ active: isActive }">
:class="{ active: isActive }"
class="active"

const isActive = ref(true)
</pre>
<pre :class="{ active: isActive, 'text-danger': hasError }">
:class="{ active: isActive, 'text-danger': hasError }"
class="active"

const isActive = ref(true)
const hasError = ref(false)
</pre>
<pre :class="{ active: isActive, 'text-danger': isActive }">
:class="{ active: isActive, 'text-danger': isActive }"
class="active"

const isActive = ref(true)
</pre>
<pre :class="classObject">
:class="classObject"
class="active"

const classObject = reactive({
    active: true,
    'text-danger': false
})
</pre>
<pre :class="classObject2">
:class="classObject2"
class="active"

const classObject2 = computed(() => ({
    active: isActive.value && !error.value,
    'text-danger': error.value && error.value.type === 'fatal'
}))
</pre>

    <h3>배열로 바인딩 하기</h3>
<pre :class="[activeClass, errorClass]">
:class="[activeClass, errorClass]"

class="active text-danger"
const activeClass = ref('active')
const errorClass = ref('text-danger')
</pre>
<pre :class="[isActive ? activeClass : '', errorClass]">
:class="[isActive ? activeClass : '', errorClass]"
class="active text-danger"

const isActive = ref(true)
const activeClass = ref('active')
const errorClass = ref('text-danger')
</pre>
    <p>위 코드는 errorClass를 항상 적용하지만, activeClass는 isActive가 truthy 일 때만 적용됩니다.</p>

    <h3>컴포넌트에서 사용하기</h3>

    <h2>인라인 스타일 바인딩</h2>
    <h3>객체로 바인딩</h3>
<pre :style="{ color: activeColor, fontSize: fontSize + 'px' }">
:style="{ color: activeColor, fontSize: fontSize + 'px' }"
style="color: darkviolet; font-size: 14px;"

const activeColor = ref('darkviolet')
const fontSize = ref(14)
</pre>
<pre :style="styleObject">
:style="styleObject"
style="color: darkviolet; font-size: 14px;"

const styleObject = reactive({
    color: 'darkviolet',
    fontSize: '14px'
})
</pre>

    <h3>배열로 바인딩 하기</h3>
<pre :style="[baseStyles, overridingStyles]">
:style="[baseStyles, overridingStyles]"
style="color: darkviolet; font-size: 14px;"

const baseStyles = reactive({
    color: 'blue',
    fontSize: '14px',
});

const overridingStyles = reactive({
    color: 'darkviolet', // baseStyles의 color를 덮어씀
});
</pre>

    <h3>접두사 자동완성</h3>
<pre :style="{ display: ['flex', '-webkit-box', '-ms-flexbox'] }">
:style="{ display: ['flex', '-webkit-box', '-ms-flexbox'] }"
style="display: -webkit-box;"
</pre>
    <p>이 경우, 브라우저가 지원하는 배열 내 마지막 값을 렌더링합니다. <br>이 예제에서 브라우저가 flex와 -webkit-box 속성만 지원한다면, flex라는 표준 속성 값이 있음에도 display: -webkit-box를 렌더링 합니다.</p>


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

const activeColor = ref('darkviolet')
const fontSize = ref(14)

const styleObject = reactive({
  color: 'darkviolet',
  fontSize: '14px'
})

const baseStyles = reactive({
    color: 'blue',
    fontSize: '14px',
});

const overridingStyles = reactive({
    color: 'darkviolet', // baseStyles의 color를 덮어씀
});
</script>

<style>
/* code {display:block;margin-bottom:8px;background-color: #f6f6f6;padding:16px 20px;border-radius: 8px;} */
</style>