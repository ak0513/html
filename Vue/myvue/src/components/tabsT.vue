<template>
    <div>
        <div role="tablist">
            <button v-for="(tab, index) in tabs" 
                type="button" role="tab" 
                :key="index" 
                @click="currentTab = index"
                :aria-selected="currentTab === index ? 'true' : 'false'">
                {{ tab.label }}
            </button>
        </div>
        <component :is="tabs[currentTab].component"></component>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TabOne from './template-syntax.vue';
import TabTwo from './reactivity-fundamentals.vue';

const currentTab = ref(0);
const tabs = [
    { label: '템플릿 문법', component: TabOne },
    { label: '반응형 기초', component: TabTwo }
];
</script>