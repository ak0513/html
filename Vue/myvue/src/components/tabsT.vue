<template>
    <div>
        <div role="tablist">
            <!-- <button v-for="(tab, index) in tabs" 
                type="button" role="tab" 
                :key="index" 
                @click="currentTab = index"
                :aria-selected="currentTab === index ? 'true' : 'false'"
                :aria-controls="'tab' + index"
                :class="{ active: currentTab === index }">
                {{ tab.label }}
            </button> -->
            <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectTab(index)"
                :aria-selected="isSelected(index)"
                :aria-controls="getTabId(index)"
                role="tab"
                :class="{ active: isSelected(index) }">
            {{ tab.label }}
            </button>
        </div>
        <!--  모든 컴포넌트가 show hide로 노출 -->
        <div class="tab_wrap">
            <component 
                v-for="(tab, index) in tabs" 
                :key="index"
                :is="tab.component"
                v-show="currentTab === index"
            />
        </div>
    <!-- 하나의 컴포넌트만 노출
    <component :is="tabs[currentTab].component"></component> -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Tab1 from './template-syntax.vue';
import Tab2 from './reactivity-fundamentals.vue';
import Tab3 from './computed-properties.vue';
import Tab4 from './class-style.vue';
import Tab5 from './conditional-rendering.vue';

const currentTab = ref(0); // 초기값을 변경하면 처음 로딩 시 선택된 탭이 달라짐.
const tabs = [
    { label: '템플릿 문법', component: Tab1 },
    { label: '반응형 기초', component: Tab2 },
    { label: '계산된 속성', component: Tab3 },
    { label: '클래스와 스타일', component: Tab4 },
    { label: '조건부 렌더링', component: Tab5 }
];


// 탭 선택 함수
function selectTab(index) {
  currentTab.value = index;
}

// 선택된 탭인지 확인하는 함수
function isSelected(index) {
  return currentTab.value === index;
}

// 각 탭에 고유한 ID 반환
function getTabId(index) {
  return `tab${index}`;
}
</script>

<style scoped>
/* active 클래스를 이용한 스타일링 */
.active {
  font-weight: bold;
  color:darkcyan;
}
</style>