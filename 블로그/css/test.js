document.addEventListener('DOMContentLoaded', function() {
    var highlightEle = document.querySelectorAll('.highlight');
    highlightEle.forEach(function(item) {
        if(item.classList.contains('html')) {
            var ele = item.firstElementChild
            var eleHtml = ele.parentElement.innerHTML;
            eleHtml = eleHtml.replaceAll('<', '&lt;');
            eleHtml = eleHtml.replaceAll('>', '&gt;');
            eleHtml = eleHtml.trim();
            item.innerHTML = '<div class="hljs-header">HTML</div><pre><code>' + eleHtml + '</code></pre>';
        } else if(item.classList.contains('js')) {
            var eleHtml = item.innerHTML
            eleHtml = eleHtml.trim();
            item.innerHTML = '<div class="hljs-header">JAVASCRIPT</div><pre><code>' + eleHtml + '</code></pre>';
        } else if(item.classList.contains('css')) {
            var eleHtml = item.innerHTML
            eleHtml = eleHtml.trim();
            item.innerHTML = '<div class="hljs-header">CSS</div><pre><code>' + eleHtml + '</code></pre>';
        }
    })
    hljs.initHighlightingOnLoad();

    /* 이미지 변환 */
    // DOM에서 모든 p 태그를 선택합니다.
    var paragraphs = document.querySelectorAll('p');

    // 선택된 각 p 태그를 순회하면서 클래스가 없는 것을 골라냅니다.
    for (var i = 0; i < paragraphs.length; i++) {
        var paragraph = paragraphs[i];
        // 클래스가 없는 경우에 대한 조건을 확인합니다.
        if (paragraph.classList.length === 0 && !!paragraph.innerText.match('##_Image')) {
            var innerTxt = paragraph.innerText
            var imgUrl = innerTxt.split('|')[1].split('@')[1];
            var caption = innerTxt.split('|')[4].split(',')[3].split('"')[3];
            paragraph.innerHTML = `<figure class="imageblock"><span><img src="https://blog.kakaocdn.net/dn/${imgUrl}" alt=""></span><figcaption>${caption}</figcaption></figure>`;

            while (paragraph.firstChild) {
                paragraph.parentNode.insertBefore(paragraph.firstChild, paragraph);
            }
            // p 태그를 제거합니다.
            paragraph.parentNode.removeChild(paragraph);
        }
    }
})

/* 샘플 버튼 제어 */
var btnSample = document.querySelectorAll('.sample-btn button');
btnSample.forEach(function(item) {
    item.addEventListener('click', function() {
        var itemSiblings = ui.siblings(item);
        itemSiblings.forEach(function(item) {
            item.classList.remove('on')
        })
        item.classList.add('on');
    })
})


