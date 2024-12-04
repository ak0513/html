document.addEventListener('DOMContentLoaded', function() {
	setAttrRandomNum(document.querySelectorAll('link[rel="stylesheet"]'), 'href');
	setAttrRandomNum(document.querySelectorAll('script[src]'), 'src');

	setDeviceInfo();  // deviceInfo 세팅
	setBodyClass();   // body에 device별 클래스 추가
	tab();            // 탭
	accordion();      // 아코디언
	setCheckAll();    // 체크박스 전체선택
	scrolldown();     // 스크롤 시 오브젝트 보여주기
})

window.addEventListener("scroll", function() {
	scrolldown();    // 스크롤 시 오브젝트 보여주기
});

document.addEventListener('keyup', function(event) {
	if(event.keyCode === 27) {
		// 모달 ESC키로 닫기
		var modalVisible = document.querySelectorAll('.modal.active');
		var modalVisible_max = 0;
		var modalVisible_maxIndex = null;
		modalVisible.forEach(function(item, index) {
			var z = window.getComputedStyle(item).zIndex;
			if(z > modalVisible_max){
				modalVisible_max = z;
				modalVisible_maxIndex = index;
			}
		})
		if(modalVisible.length > 0){
			var modalVisibleClose = modalVisible[modalVisible_maxIndex].getAttribute('id');
			closeModal('#' + modalVisibleClose);
		}
	}
})

var ua = navigator.userAgent.toLowerCase();

// UserAgent 객체 생성
var userAgent = {
	BlackBerry: () => /blackberry/i.test(ua),
	Android: () => /android/i.test(ua),
	iOS: () => /iphone|ipad|ipod/i.test(ua),
	iPhone: () => /iphone/i.test(ua),
	iPad: () => /ipad/i.test(ua),
	Windows: () => /windows/i.test(ua),
	edge: () => /edge|edg/i.test(ua),
	opera: () => /opr/i.test(ua),
	chrome: () => /chrome/i.test(ua),
	msie: () => /trident/i.test(ua),
	firefox: () => /firefox/i.test(ua),
	safari: () => /safari/i.test(ua),
	any: () => (
		userAgent.Android() || userAgent.BlackBerry() || userAgent.iOS() || userAgent.Opera() || userAgent.Windows()
	),
	isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
};

// Device 정보를 저장할 객체
var deviceInfo = {
	os: null,
	device: null,
	browser: null,
	version: null,
	mobile: userAgent.isMobile(),
};

// OS 체크
function getOS() {
	if (userAgent.iOS()) return 'os_ios';
	if (userAgent.Android()) return 'os_android';
	if (userAgent.BlackBerry()) return 'os_blackBerry';
	if (userAgent.Windows()) return 'os_windows';
	return 'other-os';
};

// Device 체크
function getDevice() {
	if (userAgent.iPhone()) return 'iphone';
	if (userAgent.iPad()) return 'ipad';
	return 'other-device';
};

// Browser 체크
function getBrowser() {
	if (userAgent.edge()) return 'edge';
	if (userAgent.opera()) return 'opera';
	if (userAgent.chrome()) return 'chrome';
	if (userAgent.msie()) return 'msie';
	if (userAgent.firefox()) return 'firefox';
	if (userAgent.safari()) return 'safari';
	return 'other-browser';
};

// Version 구하기
function getVersion(agent) {
	var matches = ua.match(new RegExp(`${agent}\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)`)) || ua.match(new RegExp(`${agent}\/([0-9]+\.[0-9]+\.[0-9]+)`));
	if (matches) return matches[1].split('.')[0];
	return null;
};

// deviceInfo 설정
function setDeviceInfo() {
	deviceInfo.os = getOS();
	deviceInfo.device = getDevice();
	deviceInfo.browser = getBrowser();
	deviceInfo.version = getVersion(deviceInfo.browser);
};

// body에 device별 클래스 추가
function setBodyClass(){
	var platform = deviceInfo.mobile ? 'mobile' : 'pc';
	var bodyClass = `${platform} ${deviceInfo.os} ${deviceInfo.browser} ver${deviceInfo.version} ${deviceInfo.device}`;
	document.body.setAttribute('class', bodyClass);
};


// class 삭제
function removeClass(ele, className) {
	for(var i = 0; i < ele.length; i++) {
		ele[i].classList.remove(className)
	}
}

// 난수 생성
function getRandomNum() {
	return new Date().setDate(new Date().getDate())
}

// attr 난수 적용
function setAttrRandomNum(ele, attr) {
	for(var i = 0; i < ele.length; i++) {
		var eleAttr = ele[i].getAttribute(attr)
		eleAttr = eleAttr + '?' + getRandomNum();
		ele[i].setAttribute(attr, eleAttr)
	}
}

// attr 세팅
function attr(ele, attr, value) {
	ele.forEach(function(item) {
		item.setAttribute(attr, value)
	})
}

// attr 삭제
function removeAttr(ele, attr) {
	ele.forEach(function(item) {
		item.removeAttribute(attr)
	})
}

// url파라미터 값 구하기
function getUrlParam(param) {
	var urlParams = new URL(location.href).searchParams;
	var name = urlParams.get(param);
	return name;
}

// 이전 요소 전체 찾기
function prevAll(ele, selector) {
	var prevAllElements = [];
	var currentEle = ele.previousElementSibling;
	while (currentEle) {
		if (!selector || currentEle.matches(selector)) {
			prevAllElements.push(currentEle);
		}
		currentEle = currentEle.previousElementSibling;
	}
	return prevAllElements;
}

// 다음 요소 전체 찾기
function nextAll(ele, selector) {
	var nextAllEle = [];
	var currentEle = ele.nextElementSibling;
	while (currentEle) {
		if (!selector || currentEle.matches(selector)) {
			nextAllEle.push(currentEle);
		}
		currentEle = currentEle.nextElementSibling;
	}
	return nextAllEle;
}

// 형제요소 찾기
function siblings(ele) {
	if(typeof(ele) === 'string') {
		ele = document.querySelector(ele)
	}
	var siblings = [...ele.parentNode.children].filter((child) =>
		child !== ele
	)
	return siblings
}

// 포커스 비활성화(접근성)
function accessDisable(eleDisable, module) {
	if(eleDisable.length > 0) {
		eleDisable = Array.from(eleDisable);
		eleDisable.forEach(function(item) {
			accessDisableFn(item)
		})
	} else {
		accessDisableFn(eleDisable)
	}

	function accessDisableFn(ele) {
		var itemFocusTags = ele.querySelectorAll('input:not([tabindex]), button:not([tabindex]), a:not([tabindex]), select:not([tabindex]), textarea:not([tabindex])');
		var itemTabindex = ele.querySelectorAll('[tabindex="0"]');
		var itemTabindexM = ele.querySelectorAll('[tabindex="-1"]');
		if(!ele.hasAttribute('aria-hidden')) {
			ele.setAttribute('aria-hidden','true');
			ele.classList.add('is-a11y-' + module + '-hidden');
		} else {
			ele.classList.add('is-a11y-' + module + '-fixed');
		}
		
		itemFocusTags.forEach(function(item) {
			item.setAttribute('tabindex', -1);
			item.classList.add('is-a11y-' + module + '-tags');
		})
		itemTabindex.forEach(function(item) {
			item.setAttribute('tabindex', -1);
			item.classList.add('is-a11y-' + module + '-tabindex');
		})
		itemTabindexM.forEach(function(item) {
			item.classList.add('is-a11y-' + module + '-fixed');
		})
	}
}

// 포커스 비활성화(접근성)
function accessEnable(eleEnable, module) {
	if(eleEnable.length > 0) {
		eleEnable = Array.from(eleEnable);
		eleEnable.forEach(function(item) {
			accessEnableFn(item)
		})
	} else {
		accessEnableFn(eleEnable)
	}

	function accessEnableFn(ele) {
		if(ele.classList.contains('is-a11y-' + module + '-hidden')) {
			ele.removeAttribute('aria-hidden');
			ele.classList.remove('is-a11y-' + module + '-hidden');
		} else {
			ele.classList.remove('is-a11y-' + module + '-fixed');
		}

		var itemFocusTags = ele.querySelectorAll('.is-a11y-' + module + '-tags');
		var itemTabindex = ele.querySelectorAll('.is-a11y-' + module + '-tabindex');
		var itemTabindexM = ele.querySelectorAll('.is-a11y-' + module + '-fixed');

		itemFocusTags.forEach(function(item) {
			item.removeAttribute('tabindex');
			item.classList.remove('is-a11y-' + module + '-tags');
		})
		itemTabindex.forEach(function(item) {
			item.setAttribute('tabindex', 0);
			item.classList.remove('is-a11y-' + module + '-tabindex');
		})
		itemTabindexM.forEach(function(item) {
			item.classList.remove('is-a11y-' + module + '-fixed');
		})
	};
}

// 모달 열기
function openModal(target, btn) {
	var modal = document.querySelector(target);
	var openedModal = document.querySelectorAll('.modal.active');

	modal.setAttribute('aria-modal', 'true');
	setTimeout(function() {modal.focus()},1);
	modal.classList.add('visible');
	setTimeout(function() {modal.classList.add('active')},100);

	// role 추가하기
	if(!modal.classList.contains('alert')) {
		modal.setAttribute('role', 'dialog');
	} else {
		modal.setAttribute('role', 'alertdialog');
	}

	// 모달이 여러개인 경우 z-index 추가하기
	if(openedModal.length > 0) {
		modal.style.zIndex = 1000 + openedModal.length;
	}

	// 포커스 회귀하기 위해 클래스 추가
	btn.setAttribute('data-modal', target);

	// modal-body에 스크롤이 있는 경우 tabindex 추가
	var modalBody = modal.querySelector('.modal-body');
	var contentHeight = modalBody.scrollHeight; // 콘텐츠 전체 높이
	var visibleHeight = modalBody.clientHeight; // 현재 보이는 높이
	if (contentHeight > visibleHeight) {
		modalBody.setAttribute('tabindex', '0');
	} else {
		modalBody.removeAttribute('tabindex'); // 필요 시 tabindex 제거
	}

	// 접근성 소스
	if(!btn.closest('.modal')) {
		accessDisable(prevAll(modal), 'modal');
	} else {
		accessDisable(btn.closest('.modal'), 'modal');
	}
	
}

// 모달 닫기
function closeModal(target) {
	var modal = document.querySelector(target);
	var openedBtn = document.querySelector('[data-modal="'+ target + '"]');
	var openedModal = document.querySelectorAll('.modal.active');
	modal.classList.remove('active')
	setTimeout(function() {modal.classList.remove('visible')},100);

	// 접근성 소스
	if(openedModal.length > 1) {
		accessEnable(openedBtn.closest('.modal'), 'modal');
	} else {
		accessEnable(prevAll(modal), 'modal');
	}

	// 포커스 회귀
	setTimeout(function() {
		openedBtn.focus();
	},300)
	openedBtn.removeAttribute('data-modal');

	// aria 제거
	modal.removeAttribute('aria-modal')
}


// slideDown
function showCollapse(ele, speed) {
	ele.classList.remove('collapse');
	ele.classList.add('collapsing');
	ele.style.height = ele.scrollHeight + 'px';
	setTimeout(function() {
		ele.classList.remove('collapsing');
		ele.classList.add('collapse', 'show');
		ele.removeAttribute('style', 'height');
	}, speed)
}

// slideUp
function hideCollapse(ele, speed) {
	ele.style.height = ele.scrollHeight + 'px';
	setTimeout(function() {
		ele.removeAttribute('style', 'height');
	})
	ele.classList.remove('collapse', 'show');
	ele.classList.add('collapsing');
	setTimeout(function() {
		ele.classList.remove('collapsing');
		ele.classList.add('collapse');
	}, speed)
}


// 탭
function tab() {
	var tabBtns = document.querySelectorAll('.tab-btn');
	tabBtns.forEach(function(tabBtnsEle) {
		tabBtnsEle.addEventListener('click', function() {
			if(tabBtnsEle.parentElement.classList.contains('current')) {
				return;
			}
			var tab = tabBtnsEle.closest('.tab');
			var tabBtn = tab.querySelectorAll('.tab-btn');
			// var tabItem = tab.querySelectorAll('.tab-item');
			// var tabPannel = tab.querySelectorAll('.tab-panel');
			var tabItem = siblings(tabBtnsEle.parentElement);
			var tabPannel = tabBtnsEle.closest('.tab-group').nextElementSibling.children;
			var controls = this.getAttribute('aria-controls');
			// 초기화
			removeClass(tabItem, 'current');
			removeClass(tabPannel, 'current');
			attr(tabBtn, 'aria-selected', 'false');
			// 세팅
			this.parentElement.classList.add('current');
			this.setAttribute('aria-selected', true)
			tab.querySelector('#' + controls).classList.add('current');
		});
	})
}


// 아코디언
function accordion() {
	var accordionBtns = document.querySelectorAll('.accordion-button');
	accordionBtns.forEach(function(accBtnsEle) {
		accBtnsEle.addEventListener('click', function(e) {
			accordionToggle(e.target)
		})
	})

	function accordionToggle(target) {
		var self = target;
		var accordion =  self.closest('.accordion'); // 클릭 요소의 부모 .accordion
		var accBtn = accordion.querySelectorAll('.accordion-button'); // 클릭 요소 부모의 모든 버튼
		var accItem = self.closest('.accordion-item'); // 클릭 요소의 .accordion-item
		var accCollapseSiblings = siblings(accItem); // 클릭 요소의 형제 .accordion-item
		var accCollapse = accordion.querySelector('#' + self.getAttribute('aria-controls')); // 클릭 요소의 .accordion-collapse
		// 닫혀 있는 아코디언 클릭 하는 경우
		if(self.classList.contains('collapsed')) {
			// 클릭 요소의 accordion-collapse show
			showCollapse(accCollapse, 350);
			// 클릭 요소의 형제 accordion-collapse hide
			accCollapseSiblings.forEach(function(accCollapseSiblingsEle) {
				if(accCollapseSiblingsEle.querySelector('.accordion-collapse').classList.contains('show')) {
					hideCollapse(accCollapseSiblingsEle.querySelector('.accordion-collapse'), 350);
				}
			});
			// 클릭 요소의 형제 accordion-header hide
			accBtn.forEach(function(accBtnEle) {
				hideHeader(accBtnEle);
			})
			// 클릭 요소의 accordion-header show
			showHeader(self);
		} else { // 열려 있는 아코디언 클릭하는 경우
			// 클릭 요소의 accordion-collapse hide
			hideCollapse(accCollapse, 350);
			// 클릭 요소의 accordion-header hide
			hideHeader(self);
		}
		// 아코디언 오픈 시 아코디언 상단으로 이동시키기
		setTimeout(function() {
			// if(accCollapse.clientHeight > window.innerHeight) {
				// scrollTo(0, self.offsetTop)
				window.scroll({
					top: self.offsetTop,
					left:0,
					behavior: 'smooth'
				})
			// }
		},350)
		
	}

	function hideHeader(target) {
		target.classList.add('collapsed');
		target.setAttribute('aria-expanded', false);
	}

	function showHeader(target) {
		target.classList.remove('collapsed');
		target.setAttribute('aria-expanded', true);
	}
}


function setCheckAll() {
	// 전체 선택 체크박스
	var selectAllCheckbox = document.getElementById('select-all');

	// 모든 체크박스들
	var checkboxes = document.querySelectorAll('.checkbox');

	// 전체 선택 체크박스를 클릭하면 모든 체크박스를 선택/해제
	selectAllCheckbox.addEventListener('change', function() {
		checkboxes.forEach(function(checkbox) {
			checkbox.checked = selectAllCheckbox.checked;
		});
	});

	// 개별 체크박스를 클릭하면 전체 선택 체크박스의 상태를 갱신
	checkboxes.forEach(function(checkbox) {
		checkbox.addEventListener('change', function() {
			selectAllCheckbox.checked = checkboxes.length === document.querySelectorAll('.checkbox:checked').length;
			selectAllCheckbox.indeterminate = document.querySelectorAll('.checkbox:checked').length > 0 && document.querySelectorAll('.checkbox:checked').length < checkboxes.length;
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {

	
});




/***** 개인정보 마스킹 *****/
// 성명 마스킹
function maskName(name) {
	if (name.length === 1) {
		return name;
	} else if (name.length === 2) {
		return name.charAt(0) + '*';
	} else {
		const firstChar = name.charAt(0);
		const lastChar = name.charAt(name.length - 1);
		const middleStars = '*'.repeat(name.length - 2);
		
		return firstChar + middleStars + lastChar;
	}

	return lastName + firstName;
}

// 하이픈 제거
function convertToNumer(phoneNumber) {
	var numericNumber = phoneNumber.replace(/-/g, '');
	return numericNumber;
}


// 휴대폰 번호 마스킹
function maskCellPhone(phoneNumber) {
// 휴대폰 번호가 11자리인지 확인
if (phoneNumber.length !== 11) {
	console.error("휴대폰 번호는 11자리여야 합니다.");
	return phoneNumber;
}

// 가운데 4자리를 '*'로 대체
var maskedNumber = phoneNumber.substring(0, 3) + '****' + phoneNumber.substring(7);
return maskedNumber;
}

// 계좌번호 마스킹
function maskAccountNumber(accountNumber) {
	// 앞 3자리와 뒤 3자리를 제외한 나머지 숫자를 '*'로 치환
	const maskedNumber = accountNumber.slice(0, 3) + '*'.repeat(accountNumber.length - 6) + accountNumber.slice(-3);
	return maskedNumber;
}


/***** 스크롤 이벤트 *****/
// 스크롤 시 오브젝트 보여주기
function scrolldown() {
	var scrolldownEle = document.querySelectorAll("[data-scrolldown]");
	scrolldownEle.forEach(function(item) {
		var elementRect = item.getBoundingClientRect();
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		var elementHeight = item.clientHeight;
		var scrollDown = item.dataset.scrolldown;
		var startPos = 0.2; // 기본값 viewportHeight 하단 기준 20%에서 시작
		var startLine = null; // 오브젝트가 보여지기 시작하는 위치

		if(scrollDown.length === 0) {
			startLine = viewportHeight *  (1 - startPos);
		} else {
			startPos = Number(scrollDown);
			startLine = scrollDown.indexOf('.') > -1 ? viewportHeight *  (1 - startPos) : viewportHeight - startPos // 소수점이면 백분율로 아니면 px로 계산
		}

		if (elementRect.top + elementHeight < startLine) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});
}
