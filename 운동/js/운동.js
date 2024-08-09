// 불러올 컨텐츠가 들어있는 URL
var Shoulder = './어깨.html';
var Chest = './가슴.html';
var Low = './등.html';
var Curl = './팔.html';
var Leg = './하체.html';
var Core = './코어.html';
var Stretching = './스트레칭.html';
// var section08 = './루틴.html';
var RoutineSplit = './분할 루틴.html';
var RoutineShoulder = './어깨 루틴.html';
var RoutineChest = './가슴 루틴.html';
var RoutineLow = './등 루틴.html';
var RoutineCurl = './팔 루틴.html';
var RoutineLeg = './하체 루틴.html';

function loadData(url, targetElementId, callback) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const targetElement = document.getElementById(targetElementId);
            if (targetElement) {
                targetElement.innerHTML = data;
                if (callback && typeof callback === 'function') {
                    callback(); // 콜백 함수 호출
                }
            } else {
                console.error(`Target element with ID '${targetElementId}' not found.`);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function callback() {

}

loadData(Shoulder, 'Shoulder', callback);
loadData(Chest, 'Chest', callback);
loadData(Low, 'Low', callback);
loadData(Curl, 'Curl', callback);
loadData(Leg, 'Leg', callback);
loadData(Core, 'Core', callback);
loadData(Stretching, 'Stretching', callback);
// loadData(section08, 'section08', callback);

loadData(RoutineSplit, 'RoutineSplit', callback);
loadData(RoutineShoulder, 'RoutineShoulder', callback);
loadData(RoutineChest, 'RoutineChest', callback);
loadData(RoutineLow, 'RoutineLow', callback);
loadData(RoutineCurl, 'RoutineCurl', callback);
loadData(RoutineLeg, 'RoutineLeg', callback);


function playVideo(videoEle) {
    const video = document.getElementById(videoEle);
    video.play();
}

function getUrlParam(param) {
    var urlParams = new URL(location.href).searchParams;
    var name = urlParams.get(param);
    return name;
}


function popup() {
    var popWrap = document.querySelectorAll('.modal')
    var btnPopOpen = document.querySelectorAll('[data-modal-open');
    var btnPopClose = document.querySelectorAll('[data-modal-close');

    console.log(popWrap)
    popWrap.forEach(function(item) {
        item.setAttribute('aria-modal', 'true');
        item.setAttribute('role', 'dialog');
        item.setAttribute('tabindex', 0);
        document.querySelector('#' + item.getAttribute('aria-labelledby'));
        item.addEventListener('keydown', function(e) {
            if(e.keyCode === 27) {
                popClose(item);
            }
        });
    })

    btnPopOpen.forEach(function(item, i) {
        item.setAttribute('aria-haspopup', 'dialog');
        btnPopOpens(i);
    })
    
    btnPopClose.forEach(function(item, i) {
        btnPopCloses(item, i); 
    })

    function btnPopOpens(i) {
        btnPopOpen[i].addEventListener('click', popOpen);
    }

    function btnPopCloses(ele, i) {
        btnPopClose[i].addEventListener('click', function() {
            popClose(ele);
        });
    }

    function popOpen(e) {
        ele = e.target;
        var controls = ele.dataset.modalOpen;
        var target = document.querySelector(controls);
        setTimeout(function() {target.focus()},1);
        target.classList.add('visible');
        setTimeout(function() {target.classList.add('active')},100);
        target.setAttribute('aria-modal', 'true');
        // 포커스 회귀하기 위해 클래스 추가
        ele.classList.add(controls.slice(1));
        // 접근성 소스
        // accessDisable(prevAll(target), 'modal');
    }

    function popClose(ele) {
        var target = ele.closest('.modal')
        var openedBtn = document.querySelector('[data-modal-open].'+ target.getAttribute('id'));
        target.classList.remove('active')
        setTimeout(function() {target.classList.remove('visible')},100);
        // 포커스 회귀
        openedBtn.focus();
        openedBtn.classList.remove(target.getAttribute('id'));
        // 접근성 소스
        // accessEnable(prevAll(target), 'modal');
    }
}

setTimeout(function() {
    popup();
},1000)