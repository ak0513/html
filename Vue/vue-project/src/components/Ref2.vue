<template>
    <h1>ref</h1>
    <p>Vue 3의 Composition API에서 ref는 반응성(Reactivity)을 적용하기 위한 함수입니다. ref를 사용하면 Vue 컴포넌트의 상태를 관리하고 템플릿과 로직 사이에서 데이터의 변화를 자동으로 감지하고 반영할 수 있습니다. 기본적으로 JavaScript의 원시 값이나 객체를 Vue의 반응성 시스템과 연결하여 사용할 수 있게 만들어 줍니다.</p>
    <p>ref 함수는 원시 값이나 객체를 감싸서 반응성을 부여하고, .value 속성을 통해 원래 값을 가져올 수 있습니다. 아래는 ref의 기본적인 사용 방법과 특징에 대한 예시입니다:</p>
    <h2>예시1</h2>
    <div>
        <p v-if="flag">이 내용이 표시됩니다.</p>
        <button @click="toggleFlag">플래그 토글</button>
    </div>
    
    <h2>예시2</h2>
    <div>
        <p>{{ message }}</p>
        <button @click="updateMessage">메시지 업데이트</button>
    </div>

    <h2>예시3</h2>
    <div>
        <p :class="{ active: isActive }">이 내용이 표시됩니다.</p>
        <p :class="{ active: true }">active: true</p>
        <p :class="{ active: false }">active: false</p>
        <button @click="toggleClass">클래스 토글</button>
    </div>

    <p>ref를 사용하면 데이터의 변화를 자동으로 감지하고 반영하는 기능을 활용할 수 있으므로 템플릿과 로직 간의 데이터 흐름을 원활하게 관리할 수 있습니다.</p>
    <p>ref의 또 다른 특징은 Vue 컴포넌트 외부에서 사용되는 경우에는 반응성이 적용되지 않습니다. 따라서 다른 모듈 등에서 반응성을 유지하려면 toRefs나 reactive와 같은 API를 사용해야 합니다.</p>
    <p>ref를 사용하여 컴포넌트의 데이터를 만들면 Vue는 내부적으로 데이터 변화를 추적하여 효율적으로 화면을 업데이트하고, 앱의 상태를 관리하기에 유용한 강력한 기능을 제공합니다.</p>
</template>


<script setup>
import { ref, computed } from 'vue'

const flag = ref(true);

const toggleFlag = () => {
  flag.value = !flag.value;
};

const message = ref('안녕하세요');

const updateMessage = () => {
  message.value = 'Hello, Vue!';
};

const isActive = ref(true)

const toggleClass = () => {
    isActive.value = !isActive.value;
};
</script>

<style scoped>
p { margin-top:10px;}
.active {color:brown}
</style>