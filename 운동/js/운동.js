// 불러올 컨텐츠가 들어있는 URL
var section01 = './어깨.html';
var section02 = './가슴.html';
var section03 = './등.html';
var section04 = './이두.html';
var section05 = './삼두.html';
var section06 = './하체.html';
var section07 = './코어.html';
var section08 = './루틴.html';

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

loadData(section01, 'section01', callback);
loadData(section02, 'section02', callback);
loadData(section03, 'section03', callback);
loadData(section04, 'section04', callback);
loadData(section05, 'section05', callback);
loadData(section06, 'section06', callback);
loadData(section07, 'section07', callback);
loadData(section08, 'section08', callback);