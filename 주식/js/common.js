// 불러올 컨텐츠가 들어있는 URL
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

loadData('./header.html', 'header', callback);


function callback() {
    toggleMenu()
}
function toggleMenu() {
    var btnOpenAllMenu = document.querySelector('.btn-allmenu');
    var allMenu = document.querySelector('#allMenu');
    btnOpenAllMenu.addEventListener('click', function() {
        allMenu.classList.toggle('allmenu-open')
    })
}