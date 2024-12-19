<template>
    <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/class-and-style.html#binding-html-classes" target="_blank">클래스와 스타일</a></h1>
    <h2>HTML 클래스 바인딩</h2>
    <h3>객체로 바인딩 하기</h3>
	<code :class="{ active: isActive }">
        :class="{ active: isActive }"<br>class="active"<br><br>
        const isActive = ref(true)<br>
    </code>
    <code :class="{ active: isActive, 'text-danger': hasError }">
        :class="{ active: isActive, 'text-danger': hasError }"<br>
        class="active"<br><br>
        const isActive = ref(true)<br>
        const hasError = ref(false)
    </code>
    <code :class="{ active: isActive, 'text-danger': isActive }">
        :class="{ active: isActive, 'text-danger': isActive }"<br>
        class="active"<br><br>
        const isActive = ref(true)
    </code>
    <code :class="classObject">
        :class="classObject"<br>
        class="active"<br><br>
        const classObject = reactive({<br>
            active: true,<br>
            'text-danger': false<br>
        })
    </code>
    <code :class="classObject2">
        :class="classObject2"<br>
        class="active"<br><br>
        const classObject2 = computed(() => ({<br>
            active: isActive.value && !error.value,<br>
            'text-danger': error.value && error.value.type === 'fatal'<br>
        }))
    </code>

    <h3>배열로 바인딩 하기</h3>
    <code :class="[activeClass, errorClass]">
        :class="[activeClass, errorClass]"<br>
        class="active text-danger"<br><br>
        const activeClass = ref('active')<br>
        const errorClass = ref('text-danger')
    </code>
    <code :class="[isActive ? activeClass : '', errorClass]">
        :class="[isActive ? activeClass : '', errorClass]"<br>
        class="active text-danger"<br><br>
        const isActive = ref(true)<br>
        const activeClass = ref('active')<br>
        const errorClass = ref('text-danger')
    </code>
    <p>위 코드는 errorClass를 항상 적용하지만, activeClass는 isActive가 truthy 일 때만 적용됩니다.</p>



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
</script>

<style>
code {display:block;margin-bottom:8px;background-color: #f6f6f6;padding:12px;border-radius: 8px;}
</style>