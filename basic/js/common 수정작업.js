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
	config: {
		ua: navigator.userAgent.toLowerCase()
	},

	deviceInfo: {
		os: null,
		device: null,
		browser : null,
		version : null,
		mobile : userAgent.isMobile(),
	},

	// 모바일 체크
	userAgent: {
		ua: navigator.userAgent.toLowerCase(),

		// 초기화 메서드 (필요 시 사용자 에이전트 값을 동적으로 업데이트 가능)
		init: function(userAgentString) {
			if (userAgentString) {
				this.ua = userAgentString.toLowerCase(); // 특정 UA 문자열을 사용하고 싶을 때
			}
		},

		matches: function(pattern) {
			return this.ua.match(pattern) !== null;
		},

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
		safari: function() { 
			return this.matches(/safari/i) && !this.chrome() && !this.edge(); 
		},
		any: function() {
			return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
		},
		isMobile: function() {
			return this.matches(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i);
		}
	},
	
	// body에 device별 클래스 추가
	setBodyClass : function() {
		// pc mobile 체크
		var setPlatform = deviceInfo.mobile ? 'mobile' : 'pc';
		var bodyClass = setPlatform + ' ' + deviceInfo.os + ' ' + deviceInfo.browser + ' ver' + deviceInfo.version + ' ' + deviceInfo.device;
		document.querySelector('body').setAttribute('class', bodyClass)
	},
	
	// deviceInfo 세팅
	setDeviceInfo : function() {
		// OS 체크
		var osName = (function() {
			switch(true) {
				case userAgent.iOS() : return deviceInfo.os = 'os_ios';
				case userAgent.Android() : return deviceInfo.os = 'os_android';
				case userAgent.BlackBerry() : return deviceInfo.os = 'os_blackBerry';
				case userAgent.Windows() : return deviceInfo.os = 'os_windows';
				default : return  deviceInfo.os = 'other-os';
			}
		})();
	
		// 디바이스 체크
		var deviceName = (function() {
			switch(true) {
				case userAgent.iPhone() : return deviceInfo.device = 'iphone';
				case userAgent.iPad() : return deviceInfo.device = 'ipad';
				default : return deviceInfo.device = 'other-device';
			}
		})();
	
		// 브라우저 체크
		var browserName = (function() {
			switch(true) {
				case userAgent.edge() : return deviceInfo.browser = "edge";
				case userAgent.opera() && !!window.opr: return deviceInfo.browser = "opera"
				case userAgent.chrome() && !!window.chrome: return deviceInfo.browser = "chrome";
				case userAgent.msie() : return deviceInfo.browser = "msie"
				case userAgent.firefox() : return deviceInfo.browser = "firefox";
				case userAgent.safari() : return deviceInfo.browser = "safari";
				default : return deviceInfo.browser = 'other-browser';
			}
		})();

		// 버전 체크
		var VersionName = (function() {
			switch(true) {
				case userAgent.edge() : return deviceInfo.version = getVersion('edge');
				case userAgent.opera() && !!window.opr: return deviceInfo.version = getVersion('opera');
				case userAgent.chrome() && !!window.chrome: return deviceInfo.version = getVersion('chrome');
				case userAgent.msie() : return deviceInfo.version = getVersion('msie');
				case userAgent.firefox() : return deviceInfo.version = getVersion('firefox');
				case userAgent.safari() : return deviceInfo.version = getVersion('safari');
				default : return deviceInfo.browser = 'other-browser';
			}
		})();
	},

	// 버전 구하기
	getVersion : function(agent) {
		var version = null;
		if(agent === 'edge') {
			var matches = this.config.uamatch(/edg\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
		} else if(agent === 'opera') {
			var matches = this.config.uamatch(/opera\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
		} else if(agent === 'chrome') {
			var matches = this.config.uamatch(/chrome\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
		} else if(agent === 'msie') {
			var matches = this.config.uamatch(/msie\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
		} else if(agent === 'firefox') {
			var matches = this.config.uamatch(/firefox\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
		} else if(agent === 'safari') {
			var matches = this.config.uamatch(/version\/([0-9]+\.[0-9]+)/);
			console.log('safari', matches)
		}
		if (matches) {
			version = matches[1].split('.')[0];
		}
		return version;
	},

	// 포커스 비활성화(접근성)
	accessDisable : function(eleDisable, module) {
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
				ele.classList.add('is-disable-' + module + '-aria-hidden');
			} else {
				ele.classList.add('is-disable-' + module + '-aria-fixed');
			}
			
			itemFocusTags.forEach(function(item) {
				item.setAttribute('tabindex', -1);
				item.classList.add('is-disable-' + module + '-tags');
			})
			itemTabindex.forEach(function(item) {
				item.setAttribute('tabindex', -1);
				item.classList.add('is-disable-' + module + '-tabindex');
			})
			itemTabindexM.forEach(function(item) {
				item.classList.add('is-disable-' + module + '-fixed');
			})
		}
	},

	// 포커스 비활성화(접근성)
	accessEnable : function(eleEnable, module) {
		if(eleEnable.length > 0) {
			eleEnable = Array.from(eleEnable);
			eleEnable.forEach(function(item) {
				accessEnableFn(item)
			})
		} else {
			accessEnableFn(eleEnable)
		}

		function accessEnableFn(ele) {
			if(ele.classList.contains('is-disable-' + module + '-aria-hidden')) {
				ele.removeAttribute('aria-hidden');
				ele.classList.remove('is-disable-' + module + '-aria-hidden');
			} else {
				ele.classList.remove('is-disable-' + module + '-aria-fixed');
			}

			var itemFocusTags = ele.querySelectorAll('.is-disable-' + module + '-tags');
			var itemTabindex = ele.querySelectorAll('.is-disable-' + module + '-tabindex');
			var itemTabindexM = ele.querySelectorAll('.is-disable-' + module + '-fixed');

			itemFocusTags.forEach(function(item) {
				item.removeAttribute('tabindex');
				item.classList.remove('is-disable-' + module + '-tags');
			})
			itemTabindex.forEach(function(item) {
				item.setAttribute('tabindex', 0);
				item.classList.remove('is-disable-' + module + '-tabindex');
			})
			itemTabindexM.forEach(function(item) {
				item.classList.remove('is-disable-' + module + '-fixed');
			})
		};
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
			eleAttr = eleAttr + '?' + getRandomNum();
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
		var popWrap = document.querySelectorAll('.modal')
		var btnPopOpen = document.querySelectorAll('[data-modal-open');
		var btnPopClose = document.querySelectorAll('[data-modal-close');


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
			accessDisable(prevAll(target), 'modal');
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
			accessEnable(prevAll(target), 'modal');
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