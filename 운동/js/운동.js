// 불러올 컨텐츠가 들어있는 URL
var section01 = './어깨.html';
var section02 = './가슴.html';
var section03 = './등.html';
var section04 = './이두.html';
var section05 = './삼두.html';
var section06 = './하체.html';
var section07 = './코어.html';
// var section08 = './루틴.html';
var section0801 = './어깨 루틴.html';
var section0802 = './가슴 루틴.html';
var section0803 = './등 루틴.html';
var section0804 = './이두 루틴.html';
var section0805 = './삼두 루틴.html';
var section0806 = './하체 루틴.html';
var section0807 = './코어 루틴.html';

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
// loadData(section08, 'section08', callback);

loadData(section0801, 'section0801', callback);
loadData(section0802, 'section0802', callback);
loadData(section0803, 'section0803', callback);
loadData(section0804, 'section0804', callback);
loadData(section0805, 'section0805', callback);
loadData(section0806, 'section0806', callback);
loadData(section0807, 'section0807', callback);