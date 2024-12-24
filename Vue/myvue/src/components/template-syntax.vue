<template>
    <div id="tab0" role="tabpanel">
        <h1><a href="https://v3-docs.vuejs-korea.org/guide/essentials/template-syntax.html" target="_blank">템플릿 문법</a></h1>
        <h2>HTML 출력</h2>
        <p>이중 중괄호는 데이터를 HTML이 아닌 일반 텍스트로 해석합니다. <br>실제 HTML을 출력하려면 v-html 디렉티브을 사용해야 합니다.</p>
<pre>
const rawHtml = '&lt;i&gt;메시지&lt;/i&gt;';

&lt;div&gt;텍스트 보간법 : &lbrace;&lbrace; rawHtml &rbrace;&rbrace;&lt;/div&gt;
&lt;div&gt;텍스트 보간법 : &lt;span v-html="rawHtml"&gt;&lt;/span&gt;&lt;/div&gt;

결과 : &lt;div&gt;텍스트 보간법 : &lt;i&gt;메시지&lt;/i&gt;&lt;/div&gt;
결과 : &lt;div&gt;텍스트 보간법 : &lt;span&gt;&lt;i&gt;메시지&lt;/i&gt;&lt;/span&gt;&lt;/div&gt;
</pre>
        <ol>
            <li>텍스트 보간법: {{ rawHtml }}</li>
            <li>v-html 디렉티브: <span v-html="rawHtml"></span></li>
        </ol>

        <h2>속성 바인딩</h2>
<pre>
const dynamicId = 'myDynamicId';

&lt;div v-bind:id="dynamicId"&gt;...&lt;/div&gt;

결과 : &lt;div id="myDynamicId"&gt;...&lt;/div&gt;
</pre>
        <h3>단축 문법</h3>
<pre>
const dynamicId = 'myDynamicId';

&lt;div :id="dynamicId"&gt;...&lt;/div&gt;
&lt;div :class="dynamicId"&gt;...&lt;/div&gt;
&lt;div :etc="dynamicId"&gt;...&lt;/div&gt;

결과 : &lt;div id="myDynamicId"&gt;...&lt;/div&gt;
결과 : &lt;div class="myDynamicId"&gt;...&lt;/div&gt;
결과 : &lt;div etc="myDynamicId"&gt;...&lt;/div&gt;
</pre>
        <ol hidden>
            <li v-bind:id="dynamicId">myDynamicId</li>
            <li :id="dynamicId">단축 문법: id myDynamicId</li>
            <li :class="dynamicId">단축 문법: class myDynamicId</li>
            <li :etc="dynamicId">단축 문법: class myDynamicId</li>
        </ol>

        <h3>불리언(Boolean) 속성</h3>
<pre>
const isButtonDisabled = true;

&lt;button v-bind:disabled="!isButtonDisabled"&gt;버튼&lt;/button&gt;
&lt;button v-bind:disabled="isButtonDisabled"&gt;버튼&lt;/button&gt;

결과 : &lt;button&gt;버튼&lt;/button&gt;
결과 : &lt;button disabled&gt;버튼&lt;/button&gt;
</pre>
        <ol hidden>
            <li><button v-bind:disabled="!isButtonDisabled">버튼</button></li>
            <li><button :disabled="isButtonDisabled">버튼</button></li>
        </ol>

        <h3>여러 속성을 동적으로 바인딩</h3>
<pre>
const objectOfAttrs = {
    id: 'container',
    class: 'wrapper'
};

&lt;div v-bind="objectOfAttrs"&gt;...&lt;/div&gt;
&lt;div :="objectOfAttrs"&gt;단축 문법&lt;/div&gt;

결과 : &lt;div id="container" class="wrapper"&gt;...&lt;/div&gt;
결과 : &lt;div id="container" class="wrapper"&gt;단축 문법&lt;/div&gt;
</pre>
        <ol hidden>
            <li><div v-bind="objectOfAttrs"></div></li>
            <li><div :="objectOfAttrs"></div></li>
        </ol>

        <h2>JavaScript 표현식 사용</h2>
        <h3>하나의 표현식만 가능</h3>
<pre>
const number = 0;
const id = 'type';

&lt;div&gt;&lbrace;&lbrace; number + 1 &rbrace;&rbrace;&lt;/div&gt;
&lt;div&gt;&lbrace;&lbrace; ok ? '예' : '아니오' &rbrace;&rbrace;&lt;/div&gt;
&lt;div :id="`list-$&lbrace;id&rbrace;`"&gt;...&lt;/div&gt;

결과 : &lt;div&gt;1&lt;/div&gt;
결과 : &lt;div&gt;예&lt;/div&gt;
결과 : &lt;div id="list-type"&gt;...&lt;/div&gt;
</pre>
        <ol hidden>
            <li>{{ number + 1 }}</li>
            <li>{{ ok ? '예' : '아니오' }}</li>
            <li :id="`list-${id}`"></li>
        </ol>
        
        <h3>함수 호출</h3>
<pre>
const name = 'Vue3';
const greeting = (text) => {
    return text
}

&lt;div&gt;&lbrace;&lbrace; greeting&lpar;name&rpar; &rbrace;&rbrace;&lt;/div&gt;
&lt;div&gt;&lbrace;&lbrace; greeting&lpar;'안녕하세요'&rpar; &rbrace;&rbrace;&lt;/div&gt;

결과 : &lt;div&gt;Vue3&lt;/div&gt;
결과 : &lt;div&gt;안녕하세요&lt;/div&gt;
</pre>
        <ol hidden>
            <li>{{ greeting(name) }}</li>
            <li>{{ greeting('안녕하세요') }}</li>
        </ol>

        <h2>디렉티브</h2>
<pre>
const ok = true;
const no = false;

&lt;div v-if="ok"&gt;...&lt;/div&gt;
&lt;div v-if="no"&gt;...&lt;/div&gt;

결과 : &lt;div&gt;...&lt;/div&gt;
결과 : &lt;!--v-if--&gt;
</pre>
        <ol hidden>
            <li v-if="ok">이제 이것을 볼 수 있습니다.</li>
            <li v-if="no">이제 이것을 볼 수 없습니다.</li>
        </ol>

        <h3>인자</h3>
        <p>일부 디렉티브는 디렉티브 뒤에 콜론(:)으로 표시되는 "인자"를 사용할 수 있습니다.</p>
<pre>
const dynamicId = 'myDynamicId';

&lt;div v-bind:id="dynamicId"&gt;...&lt;/div&gt;
&lt;div :id="dynamicId"&gt;...&lt;/div&gt;

결과 : &lt;div id="myDynamicId"&gt;...&lt;/div&gt;
결과 : &lt;div id="myDynamicId"&gt;...&lt;/div&gt;
</pre>
        <ol hidden>
            <li v-bind:id="dynamicId">myDynamicId</li>
            <li :id="dynamicId">단축 문법: id myDynamicId</li>
        </ol>
        <p>또 다른 예로는 DOM 이벤트를 수신하는 v-on 디렉티브입니다.<br>v-on은 단축형으로 @를 대신 사용할 수 있습니다.</p>
<pre>
const doSomething = () => {
    alert('doSomething')
}

&lt;button v-on:click="doSomething"&gt;alert&lt;/button&gt;
&lt;button @click="doSomething"&gt;alert&lt;/button&gt;

결과 doSomething 경고창 뜸
</pre>
        <ol>
            <li><button v-on:click="doSomething">alert</button></li>
            <li><button @click="doSomething">alert</button></li>
        </ol>

        <h3>동적인 인자</h3>
        <p>디렉티브의 인자를 대괄호로 감싸서 JavaScript 표현식으로 사용할 수도 있습니다.</p>
<pre>
const doSomething = () => {
    alert('doSomething')
}
const url = 'https://www.example.com';
const attributeName = 'href';
const eventName = 'click';

&lt;a v-bind:[attributeName]="url"&gt;동적인 인자&lt;/a&gt;
&lt;a :[attributeName]="url"&gt;동적인 인자&lt;/a&gt;
&lt;button v-on:[eventName]="doSomething"&gt;alert&lt;/button&gt;

결과 &lt;a href="https://www.example.com"&gt;동적인 인자&lt;/a&gt;
결과 &lt;a href="https://www.example.com"&gt;동적인 인자&lt;/a&gt;
결과 doSomething 경고창 뜸
</pre>
        <ol hidden>
            <li><a v-bind:[attributeName]="url"> 동적인 인자</a></li>
            <li><a :[attributeName]="url"> 동적인 인자</a></li>
            <li><button v-on:[eventName]="doSomething">alert</button></li>
        </ol>
    </div>
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
