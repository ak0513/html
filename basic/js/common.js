document.addEventListener('DOMContentLoaded', function() {
	ui.setAttrRandomNum(document.querySelectorAll('link[rel="stylesheet"]'), 'href');
	ui.setAttrRandomNum(document.querySelectorAll('script[src]'), 'src');

	ui.setDeviceInfo();  // deviceInfo 세팅
	ui.setBodyClass();   // body에 device별 클래스 추가
	ui.tab();            // 탭
	ui.accordion();      // 아코디언
	ui.popup();          // 팝업

	ui.scrolldown();     // 스크롤 시 오브젝트 보여주기
})

window.addEventListener("scroll", function() {
	ui.scrolldown();    // 스크롤 시 오브젝트 보여주기
});


var ui = {
	// 초기 설정
	config: {
		ua: navigator.userAgent.toLowerCase()
	},

	// device 정보
	deviceInfo: {
		os: null,
		device: null,
		browser: null,
		version: null,
		mobile: false,
	},

	// 사용자 에이전트 객체
	userAgent: {
		ua: navigator.userAgent.toLowerCase(),

		// 초기화 메서드
		/* init: function(userAgentString) {
			if (userAgentString) {
				this.ua = userAgentString.toLowerCase();
			}
		}, */

		// 공통 메서드
		matches: function(pattern) {
			return this.ua.match(pattern) !== null;
		},

		// 각 디바이스/브라우저 체크
		BlackBerry: function() { return this.matches(/blackberry/i); },
		Android: function() { return this.matches(/android/i); },
		iOS: function() { return this.matches(/iphone|ipad|ipod/i); },
		iPhone: function() { return this.matches(/iphone/i); },
		iPad: function() { return this.matches(/ipad/i); },
		Windows: function() { return this.matches(/windows/i); },
		edge: function() { return this.matches(/edge|edg/i); },
		opera: function() { return this.matches(/opr/i); },
		chrome: function() { return this.matches(/chrome/i); },
		msie: function() { return this.matches(/trident/i); },
		firefox: function() { return this.matches(/firefox/i); },
		safari: function() { return this.matches(/safari/i) && !this.chrome() && !this.edge(); },
		Macintosh: function() { return this.matches(/Macintosh/i); },

		// 운영체제 및 디바이스 정보 반환
		/* any: function() {
			return this.Android() || this.BlackBerry() || this.iOS() || this.Windows();
		} */
	},

	// 모바일 여부 체크
	isMobile: function() {
		return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(this.config.ua);
	},

	// deviceInfo 세팅
	setDeviceInfo: function() {
		// 사용자 에이전트 기반 OS 정보 추출
		this.deviceInfo.os = this.getOS();
		this.deviceInfo.device = this.getDevice();
		this.deviceInfo.browser = this.getBrowser();
		this.deviceInfo.version = this.getVersion();
		this.deviceInfo.mobile = this.isMobile(); // 모바일 여부 설정
	},


	// OS 정보 추출
	getOS: function() {
		if (this.userAgent.iOS()) return 'os_ios';
		if (this.userAgent.Android()) return 'os_android';
		if (this.userAgent.BlackBerry()) return 'os_blackBerry';
		if (this.userAgent.Windows()) return 'os_windows';
		if (this.userAgent.Macintosh()) return 'os_mac';
		return 'other-os';
	},

	// 디바이스 정보 추출
	getDevice: function() {
		if (this.userAgent.iPhone()) return 'iphone';
		if (this.userAgent.iPad()) return 'ipad';
		return 'other-device';
	},

	// 브라우저 정보 추출
	getBrowser: function() {
		if (this.userAgent.edge()) return "edge";
		if (this.userAgent.opera()) return "opera";
		if (this.userAgent.chrome()) return "chrome";
		if (this.userAgent.msie()) return "msie";
		if (this.userAgent.firefox()) return "firefox";
		if (this.userAgent.safari()) return "safari";
		return 'other-browser';
	},

	// 브라우저 버전 추출
	getVersion: function() {
		// 브라우저별 버전 정보 추출
		var version = this.getBrowserVersion();
		return version ? version : 'unknown';
	},

	// 브라우저 버전 파싱
	getBrowserVersion: function() {
		var versionPattern = {
			"edge": /edge\/([\d\.]+)/,
			"opera": /opr\/([\d\.]+)/,
			"chrome": /chrome\/([\d\.]+)/,
			"msie": /trident.*rv:([\d\.]+)/,
			"firefox": /firefox\/([\d\.]+)/,
			"safari": /version\/([\d\.]+).*safari/
		};
		for (var browser in versionPattern) {
			if (this.userAgent[browser]()) {
				var match = this.userAgent.ua.match(versionPattern[browser]);
				if (match) {
					// 소수점 제거
					return match[1].split('.')[0];
				}
			}
		}
		return null;
	},

	// body에 device별 클래스 추가
	setBodyClass: function() {
		this.setDeviceInfo();  // deviceInfo 세팅 호출
		var setPlatform = this.deviceInfo.mobile ? 'mobile' : 'pc';
		var bodyClass = `${setPlatform} ${this.deviceInfo.os} ${this.deviceInfo.browser} ver${this.deviceInfo.version} ${this.deviceInfo.device}`;
		document.querySelector('body').setAttribute('class', bodyClass);
	},

    // 포커스 비활성화(접근성)
    accessDisable: function (eleDisable, module) {
        if (!eleDisable) return;

		// 단일 요소일 경우 배열로 변환
		var elements = Array.isArray(eleDisable) || NodeList.prototype.isPrototypeOf(eleDisable) ? Array.from(eleDisable) : [eleDisable];


        elements.forEach(function (item) {
            var classPrefix = 'is-a11y-' + module;

            // aria-hidden 처리: aria-hidden이 없거나 false일 때 true로 설정
			if (!item.hasAttribute('aria-hidden') || item.getAttribute('aria-hidden') === 'false') {
				// aria-hidden이 false였던 요소는 배열에 저장
				if (item.getAttribute('aria-hidden') === 'false') {
					item.dataset.originalAriaHidden = 'false';  // originalAriaHidden에 'false' 저장
				}
				item.setAttribute('aria-hidden', 'true');
				item.classList.add(classPrefix + '-hidden');
			} else {
				item.classList.add(classPrefix + '-fixed');
			}

            // tabindex 처리
            var items = item.querySelectorAll('input, button, a, select, textarea, [tabindex]');
            items.forEach(function (subItem) {
                // tabindex가 있는 경우만 data-original-tabindex 저장
                if (!subItem.hasAttribute('data-original-tabindex') && subItem.hasAttribute('tabindex')) {
                    subItem.dataset.originalTabindex = subItem.getAttribute('tabindex');
                }
                subItem.setAttribute('tabindex', '-1');  // tabindex를 -1로 설정
                subItem.classList.add(classPrefix + '-tags');
            });
        });
    },

    // 포커스 활성화(접근성)
    accessEnable: function (eleEnable, module) {
        if (!eleEnable) return;

        // 단일 요소일 경우 배열로 변환
		var elements = Array.isArray(eleEnable) || NodeList.prototype.isPrototypeOf(eleEnable) ? Array.from(eleEnable) : [eleEnable];

        elements.forEach(function (item) {
            var classPrefix = 'is-a11y-' + module;
			// aria-hidden 복원
			if (item.classList.contains(classPrefix + '-hidden')) {
				// originalAriaHidden에 'false'가 저장되어 있으면, 복원
				if (item.dataset.originalAriaHidden === 'false') {
					item.setAttribute('aria-hidden', 'false');
					delete item.dataset.originalAriaHidden;
				} else {
					item.removeAttribute('aria-hidden');
				}
			}
            item.classList.remove(classPrefix + '-hidden', classPrefix + '-fixed');

            // tabindex 복원
            var items = item.querySelectorAll('.' + classPrefix + '-tags');
            items.forEach(function (subItem) {
                // data-original-tabindex가 있는 경우에만 복원
				console.log(subItem.dataset.originalTabindex )
                if (subItem.dataset.originalTabindex !== undefined) {
					subItem.setAttribute('tabindex', subItem.dataset.originalTabindex);  // null이 아니면 저장된 tabindex 복원
                    delete subItem.dataset.originalTabindex;  // 복원 후 dataset에서 삭제
                } else {
					subItem.removeAttribute('tabindex');  // tabindex가 없었던 경우 tabindex 속성 제거
				}
                subItem.classList.remove(classPrefix + '-tags');
            });
        });
    },

	// 형제요소 찾기
	siblings : function(ele) {
		if(typeof(ele) === 'string') {
			ele = document.querySelector(ele)
		}
		var siblings = [...ele.parentNode.children].filter((child) =>
			child !== ele
		)
		return siblings
	},

	// 이전 요소 찾기
	prev : function(ele, selector) {
		var prevEle = ele.previousElementSibling;
		if (!selector || (prevEle && prevEle.matches(selector))) {
			return prevEle;
		}
		return null;
	},

	// 이전 요소 전체 찾기
	prevAll : function(ele, selector) {
		var prevAllElements = [];
		var currentEle = ele.previousElementSibling;
		while (currentEle) {
			if (!selector || currentEle.matches(selector)) {
				prevAllElements.push(currentEle);
			}
			currentEle = currentEle.previousElementSibling;
		}
		return prevAllElements;
	},

	// 다음 요소 찾기
	next : function(ele, selector) {
		var nextEle = ele.nextElementSibling;
		if (!selector || (nextEle && nextEle.matches(selector))) {
			return nextEle;
		}
		return null;
	},

	// 다음 요소 전체 찾기
	nextAll : function(ele, selector) {
		var nextAllEle = [];
		var currentEle = ele.nextElementSibling;
		while (currentEle) {
			if (!selector || currentEle.matches(selector)) {
				nextAllEle.push(currentEle);
			}
			currentEle = currentEle.nextElementSibling;
		}
		return nextAllEle;
	},

	// 가장 가까운 부모 찾기
	/* var closest = function(ele, selector) {
		var matchesSelector = ele.matches || ele.webkitMatchesSelector || ele.mozMatchesSelector || ele.msMatchesSelector;
		while (ele) {
			if (matchesSelector.call(ele, selector)) {
				return ele;
			} else {
				ele = ele.parentElement;
			}
		}
		return null;
	} */

	// class 삭제
	removeClass : function(ele, className) {
		for(var i = 0; i < ele.length; i++) {
			ele[i].classList.remove(className)
		}
	},

	// 난수 생성
	getRandomNum : function() {
		return new Date().setDate(new Date().getDate())
	},

	// attr 난수 적용
	setAttrRandomNum : function(ele, attr) {
		for(var i =0; i < ele.length; i++) {
			var eleAttr = ele[i].getAttribute(attr)
			eleAttr = eleAttr + '?' + ui.getRandomNum();
			ele[i].setAttribute(attr, eleAttr)
		}
	},

	// attr 세팅
	attr : function(ele, attr, value) {
		ele.forEach(function(item) {
			item.setAttribute(attr, value)
		})
	},

	// attr 삭제
	removeAttr : function(ele, attr) {
		ele.forEach(function(item) {
			item.removeAttribute(attr)
		})
	},

	// url파라미터 값 구하기
	getUrlParam : function(param) {
		var urlParams = new URL(location.href).searchParams;
		var name = urlParams.get(param);
		return name;
	},

	// slideDown
    showCollapse : function(ele, speed) {
        ele.classList.remove('collapse');
        ele.classList.add('collapsing');
        ele.style.height = ele.scrollHeight + 'px';
        setTimeout(function() {
            ele.classList.remove('collapsing');
            ele.classList.add('collapse', 'show');
            ele.removeAttribute('style', 'height');
        }, speed)
    },

    // slideUp
    hideCollapse : function(ele, speed) {
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
    },


	// 탭
	tab : function() {
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
				ui.removeClass(tabItem, 'current');
				ui.removeClass(tabPannel, 'current');
				ui.attr(tabBtn, 'aria-selected', 'false');
				// 세팅
				this.parentElement.classList.add('current');
				this.setAttribute('aria-selected', true)
				tab.querySelector('#' + controls).classList.add('current');
			});
		})
	},


	// 아코디언
    accordion : function() {
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
            var accCollapseSiblings = ui.siblings(accItem); // 클릭 요소의 형제 .accordion-item
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
    },

	// 팝업
	popup : function() {
		var popWrap = document.querySelectorAll('.modal');
		var btnPopOpen = document.querySelectorAll('[data-modal-open]');
		var btnPopClose = document.querySelectorAll('[data-modal-close]');


		popWrap.forEach(function(item) {
			item.setAttribute('aria-modal', 'true');
			item.setAttribute('role', 'dialog');
			item.setAttribute('tabindex', 0);
			document.querySelector('#' + item.getAttribute('aria-labelledby'));
			item.addEventListener('keydown', function(e) {
				if(e.keyCode === 27) {
					// popClose(item);
				}
			});
		})

		btnPopOpen.forEach(function(item, index) {
			item.setAttribute('aria-haspopup', 'dialog');
			btnPopOpens(index);
		})
		
		btnPopClose.forEach(function(item, index) {
			btnPopCloses(item, index); 
		})

		function btnPopOpens(index) {
			btnPopOpen[index].addEventListener('click', popOpen);
		}

		function btnPopCloses(ele, index) {
			btnPopClose[index].addEventListener('click', function() {
				popClose(ele);
			});
		}

		function popOpen(event) {
			ele = event.target;
			var controls = ele.dataset.modalOpen;
			var target = document.querySelector(controls);
			setTimeout(function() {target.focus()},1);
			target.classList.add('visible');
			setTimeout(function() {target.classList.add('active')},100);
			target.setAttribute('aria-modal', 'true');
			// 포커스 회귀하기 위해 클래스 추가
			ele.classList.add(controls.slice(1));
			ui.accessEnable(target, 'modal');
			// 접근성 소스
			ui.accessDisable(ui.siblings(target), 'modal');
		}

		function popClose(ele) {
			var target = ele.closest('.modal')
			var openedBtn = document.querySelector('[data-modal-open].'+ target.getAttribute('id'));
			var openedPopWrap = document.querySelectorAll('.modal.active');
			target.classList.remove('active')
			setTimeout(function() {target.classList.remove('visible')},100);
			// 포커스 회귀
			openedBtn.focus();
			openedBtn.classList.remove(target.getAttribute('id'));

			console.log(openedPopWrap.length)

			// 접근성 소스
			if(openedPopWrap.length > 1) {
				ui.accessEnable(target, 'modal');
			} else {
				ui.accessEnable(ui.siblings(target), 'modal');
			}
		}
	},


	// 스크롤 시 오브젝트 보여주기
	scrolldown : function() {
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
};

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

// 팝업 열기
function openModal(target, btn) {
	var modal = document.querySelector(target);
	var openedModal = document.querySelectorAll('.modal.active');

	setTimeout(function() {modal.focus()},1);
	modal.classList.add('visible');
	setTimeout(function() {modal.classList.add('active')},100);
	modal.setAttribute('aria-modal', 'true');

	// 팝업이 여러개인 경우 z-index 추가하기
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

// 팝업 닫기
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
	openedBtn.focus();
	openedBtn.removeAttribute('data-modal');
}




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
	// '-' 제거
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