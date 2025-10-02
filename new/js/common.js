document.addEventListener('DOMContentLoaded', () => {
  UI.initAll();

  UI.util.setAttrRandomNum(document.querySelectorAll('link[rel="stylesheet"]'), 'href');
	UI.util.setAttrRandomNum(document.querySelectorAll('script[src]'), 'src');

  // Tab 스크롤 완료 후 첫 자식 요소에 tabindex 0 부여 및 포커스 이동 (접근성 보완)
  window.onTabScrollComplete = function (tabIndex, pane) {
    const firstTag = pane.firstElementChild;
    if (firstTag) {
      firstTag.setAttribute('tabindex', 0);
      firstTag.focus();
    }
  };

  /* formatter 테스트 */
  console.log(UI.formatter.addCommas(123456789)); // "123,456,789"
  console.log(UI.formatter.removeCommas("123,456,789")); // "123456789"
  console.log(UI.formatter.trimSpaces("   hello world   ")); // "hello world"
  console.log(UI.formatter.truncate("This is a long text", 10)); // "This is a ..."
  console.log(UI.formatter.removeSpecialChars("Hello!@# World$$")); // "Hello World"
  console.log(UI.formatter.formatDate("2025-09-22T10:00:00Z")); // "2025-09-22"
  console.log(UI.formatter.formatDate("2025.09.22")); // "2025-09-22"
  console.log(UI.formatter.roundTo(3.14159, 2)); // "3.14"
  console.log(UI.formatter.isValidEmail("test@example.com")); // true
  console.log(UI.formatter.isValidEmail("test#example.com")); // false
});

const UI = {
  initAll: function() {
      this.deviceInfo.init();
      this.tab.initAll();
      this.loadHTMLIncludes(UI.util.getVersion());
			this.input.init();
			this.accordion.init();
			this.tooltip.init();
  },

  /**
   * 외부 HTML 파일을 data-load-html 속성을 가진 요소에 비동기로 로드합니다.
   * @param {string} vers - 버전 정보 (캐시 방지용 쿼리스트링)
   */
  loadHTMLIncludes: function(vers) {
    // data-load-html 속성을 가진 모든 요소 선택
    const elements = document.querySelectorAll('[data-load-html]');

    elements.forEach(elmnt => {
      let file = elmnt.getAttribute('data-load-html');
      if (!file) return;

      // 버전 정보 붙이기 (캐시 방지)
      file += "?v=" + vers;

      // XMLHttpRequest 생성 및 초기화
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            // 성공: 응답 텍스트를 파싱하여 HTML과 스크립트 분리 후 적용
            elmnt.removeAttribute("data-load-html");
            elmnt.setAttribute("data-loaded-html", file);

            const parser = new DOMParser();
            const doc = parser.parseFromString(this.responseText, "text/html");

            // innerHTML로 컨텐츠 채우기
            elmnt.innerHTML = doc.body.innerHTML;

            // 스크립트 태그 찾아서 실행 (src 포함)
            const scripts = elmnt.querySelectorAll('script');
            scripts.forEach(script => {
              const newScript = document.createElement('script');
              if (script.src) {
                newScript.src = script.src;
              } else {
                newScript.textContent = script.textContent;
              }
              document.head.appendChild(newScript);
              script.remove();
            });

          } else {
            // 상태코드에 따른 에러 처리
            const messages = {
              403: "접근이 거절되었습니다.",
              404: "페이지를 찾을 수 없습니다.",
              500: "서버에 오류가 발생했습니다."
            };
            elmnt.innerHTML = messages[this.status] || "오류가 발생했습니다.";
            elmnt.removeAttribute("data-load-html");
            elmnt.setAttribute(`data-load-html-false-${this.status}`, file);
          }

          // 외부 후처리 함수 호출 (존재하면)
          if (typeof m4aComm !== "undefined" && typeof m4aComm.runAfter === "function") {
            m4aComm.runAfter();
          }
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
    });
  },

  dom: {
    /**
		 * 요소의 offsetHeight 반환 (선택자 또는 요소)
		 * @param {string|HTMLElement|null} target - 선택자 문자열 또는 DOM 요소
		 * @returns {number}
		 */
		getOffsetHeight: function(target) {
			let el = null;

			if (typeof target === 'string') {
				el = document.querySelector(target);
			} else if (target instanceof HTMLElement) {
				el = target;
			}

			return el ? el.offsetHeight : 0;
		},

    /**
		 * 여러 요소에서 특정 클래스 제거
		 * @param {NodeList|HTMLElement[]} elements - DOM 요소 배열 또는 NodeList
		 * @param {string} className - 제거할 클래스 이름
		*/
		removeClass: function(elements, className) {
			for (let i = 0; i < elements.length; i++) {
				elements[i].classList.remove(className);
			}
		},

		/**
		 * 지정 요소 이전의 모든 형제 요소 반환
		 * @param {HTMLElement} ele - 기준 요소
		 * @param {string} [selector] - 선택자 필터 (선택 사항)
		 * @returns {HTMLElement[]} - 이전 형제 요소 배열 (DOM 순서대로)
		*/
		prevAll: function(ele, selector) {
			if (!ele || !ele.previousElementSibling) return [];

			const result = [];
			let current = ele.previousElementSibling;

			while (current) {
				if (!selector || current.matches(selector)) {
					result.push(current);
				}
				current = current.previousElementSibling;
			}

			return result.reverse(); // DOM 상 순서대로 반환
		},

		/**
		 * 지정 요소 이후의 모든 형제 요소 반환
		 * @param {HTMLElement} ele - 기준 요소
		 * @param {string} [selector] - 선택자 필터 (선택 사항)
		 * @returns {HTMLElement[]} - 다음 형제 요소 배열
		*/
		nextAll: function(ele, selector) {
			if (!ele || !ele.nextElementSibling) return [];

			const result = [];
			let current = ele.nextElementSibling;

			while (current) {
				if (!selector || current.matches(selector)) {
					result.push(current);
				}
				current = current.nextElementSibling;
			}

			return result;
		},

    /**
		 * 지정 요소의 형제 요소 반환
		 * @param {HTMLElement|string} ele - 요소 또는 선택자
		 * @returns {HTMLElement[]} - 형제 요소 배열
		*/
		getSiblings: function(ele) {
			if (typeof ele === 'string') {
				ele = document.querySelector(ele);
				if (!ele) return [];
			}

			if (!ele || !ele.parentNode) return [];

			return Array.from(ele.parentNode.children).filter(child => child !== ele);
		},

		/**
		 * 요소들의 속성(setAttr) 설정
		 * @param {HTMLElement[]|NodeList} elements - 요소 배열 또는 NodeList
		 * @param {string} attr - 설정할 속성 이름
		 * @param {string} value - 설정할 값
		*/
		setAttr: function(elements, attr, value) {
			if (!elements || !attr) return;

			// elements가 배열/반복 가능한 객체가 아닐 경우 단일 요소로 감싸기
			if (!('forEach' in elements)) {
				elements = [elements];
			}

			elements.forEach(item => {
				if (item && item.setAttribute) {
					item.setAttribute(attr, value);
				}
			});
		},

		/**
		 * 요소들의 속성(attr) 제거
		 * @param {HTMLElement[]|NodeList|HTMLElement} elements - 요소 배열, NodeList 또는 단일 요소
		 * @param {string} attr - 제거할 속성 이름
		*/
		removeAttr: function(elements, attr) {
			if (!elements || !attr) return;

			if (!('forEach' in elements)) {
				elements = [elements];
			}

			elements.forEach(item => {
				if (item && item.removeAttribute) {
					item.removeAttribute(attr);
				}
			});
		},
  },

  userAgent: {
    ua: navigator.userAgent.toLowerCase(),

    /** @returns {boolean} BlackBerry 여부 */
    BlackBerry: function() {
      return /blackberry/i.test(this.ua);
    },
    /** @returns {boolean} Android 여부 */
    Android: function() {
      return /android/i.test(this.ua);
    },
    /** @returns {boolean} iOS 여부 (iPhone, iPad, iPod) */
    iOS: function() {
      return /iphone|ipad|ipod/i.test(this.ua);
    },
    /** @returns {boolean} iPhone 여부 */
    iPhone: function() {
      return /iphone/i.test(this.ua);
    },
    /** @returns {boolean} iPad 여부 */
    iPad: function() {
      return /ipad/i.test(this.ua);
    },
    /** @returns {boolean} Windows 여부 */
    Windows: function() {
      return /windows/i.test(this.ua);
    },
    /** @returns {boolean} Edge 브라우저 여부 */
    edge: function() {
      return /edge|edg/i.test(this.ua);
    },
    /** @returns {boolean} Opera 브라우저 여부 */
    opera: function() {
      return /opr/i.test(this.ua);
    },
    /** @returns {boolean} Chrome 브라우저 여부 */
    chrome: function() {
      return /chrome/i.test(this.ua);
    },
    /** @returns {boolean} Internet Explorer 여부 */
    msie: function() {
      return /trident/i.test(this.ua);
    },
    /** @returns {boolean} Firefox 브라우저 여부 */
    firefox: function() {
      return /firefox/i.test(this.ua);
    },
    /** @returns {boolean} Safari 브라우저 여부 */
    safari: function() {
      return /safari/i.test(this.ua);
    },
    /** @returns {boolean} 주요 모바일 OS/브라우저 중 하나라도 해당하는지 여부 */
    any: function() {
      return this.Android() || this.BlackBerry() || this.iOS() || this.opera() || this.Windows();
    },
    /** @returns {boolean} 모바일 디바이스 여부 */
    isMobile: function() {
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(this.ua);
    }
  },

  deviceInfo: {
    /** @type {string|null} 운영체제 */
    os: null,
    /** @type {string|null} 디바이스 */
    device: null,
    /** @type {string|null} 브라우저 */
    browser: null,
    /** @type {string|null} 브라우저 버전 (주요 버전) */
    version: null,
    /** @type {boolean|null} 모바일 여부 */
    mobile: null,

    /**
     * 초기화 함수
     * @returns {void}
     */
    init: function() {
      this.mobile = UI.userAgent.isMobile();
      this.setDeviceInfo();
      this.setBodyClass();
    },

    /**
     * 운영체제, 디바이스, 브라우저, 버전 정보를 세팅한다
     * @returns {void}
     */
    setDeviceInfo: function() {
      // OS 체크
      if (UI.userAgent.iOS()) {
        this.os = 'os_ios';
      } else if (UI.userAgent.Android()) {
        this.os = 'os_android';
      } else if (UI.userAgent.BlackBerry()) {
        this.os = 'os_blackBerry';
      } else if (UI.userAgent.Windows()) {
        this.os = 'os_windows';
      } else {
        this.os = 'other-os';
      }

      // 디바이스 체크
      if (UI.userAgent.iPhone()) {
        this.device = 'iphone';
      } else if (UI.userAgent.iPad()) {
        this.device = 'ipad';
      } else {
        this.device = 'other-device';
      }

      // 브라우저 체크
      if (UI.userAgent.edge()) {
        this.browser = 'edge';
      } else if (UI.userAgent.opera() && !!window.opr) {
        this.browser = 'opera';
      } else if (UI.userAgent.chrome() && !!window.chrome) {
        this.browser = 'chrome';
      } else if (UI.userAgent.msie()) {
        this.browser = 'msie';
      } else if (UI.userAgent.firefox()) {
        this.browser = 'firefox';
      } else if (UI.userAgent.safari()) {
        this.browser = 'safari';
      } else {
        this.browser = 'other-browser';
      }

      this.version = this.getVersion(this.browser);
    },

    /**
     * 브라우저 버전 정보를 User-Agent에서 추출한다.
     * @param {string} agent 브라우저명 (edge, opera, chrome, msie, firefox, safari)
     * @returns {string|null} 주요 버전 숫자 또는 null
     */
    getVersion: function(agent) {
      const ua = UI.userAgent.ua;
      let matches = null;

      switch (agent) {
        case 'edge':
          matches = ua.match(/edg\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
          break;
        case 'opera':
          matches = ua.match(/opera\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
          break;
        case 'chrome':
          matches = ua.match(/chrome\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
          break;
        case 'msie':
          matches = ua.match(/msie\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
          break;
        case 'firefox':
          matches = ua.match(/firefox\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
          break;
        case 'safari':
          matches = ua.match(/version\/([0-9]+\.[0-9]+)/);
          break;
        default:
          return null;
      }

      if (matches && matches[1]) {
        return matches[1].split('.')[0]; // 주요 버전만 리턴
      }
      return null;
    },

    /**
     * body 태그에 platform, os, browser, version, device 클래스를 세팅한다.
     * @returns {void}
     */
    setBodyClass: function() {
      const platform = this.mobile ? 'mobile' : 'pc';
      const classes = [platform, this.os, this.browser, `ver${this.version}`, this.device];
      document.querySelector('body').setAttribute('class', classes.filter(Boolean).join(' '));
    }
  },

  a11y: {
    /**
		 * 접근성 비활성화 (포커스, aria-hidden 등)
		 * @param {HTMLElement|HTMLElement[]} eleDisable - 비활성화할 요소(들)
		 * @param {string} module - 모듈명 (ex: "modal")
		 */
		accessDisable(eleDisable, module) {
			if (!eleDisable) return;

			const elements = (eleDisable instanceof HTMLElement)
				? [eleDisable]
				: Array.isArray(eleDisable) || eleDisable instanceof NodeList
					? Array.from(eleDisable)
					: [];

			elements.forEach(ele => {
				if (!ele) return;

				const baseClassHidden = `is-a11y-${module}-hidden`;
				const baseClassFixed = `is-a11y-${module}-fixed`;
				const baseClassTags = `is-a11y-${module}-tags`;
				const baseClassTabindex = `is-a11y-${module}-tabindex`;

				const focusTags = ele.querySelectorAll('input:not([tabindex]), button:not([tabindex]), a:not([tabindex]), select:not([tabindex]), textarea:not([tabindex])');
				const tab0 = ele.querySelectorAll('[tabindex="0"]');
				const tabM1 = ele.querySelectorAll('[tabindex="-1"]');

				if (!ele.hasAttribute('aria-hidden')) {
					ele.setAttribute('aria-hidden', 'true');
					ele.classList.add(baseClassHidden);
				} else {
					ele.classList.add(baseClassFixed);
				}

				focusTags.forEach(tag => {
					tag.setAttribute('tabindex', '-1');
					tag.classList.add(baseClassTags);
				});
				tab0.forEach(tag => {
					tag.setAttribute('tabindex', '-1');
					tag.classList.add(baseClassTabindex);
				});
				tabM1.forEach(tag => {
					tag.classList.add(baseClassFixed);
				});
			});
		},


		/**
		 * 접근성 활성화 (포커스, aria-hidden 등 복구)
		 * @param {HTMLElement|HTMLElement[]} eleEnable - 복구할 요소(들)
		 * @param {string} module - 모듈명 (ex: "modal")
		*/
		accessEnable(eleEnable, module) {
			if (!eleEnable) return;

			const elements = (eleEnable instanceof HTMLElement)
				? [eleEnable]
				: Array.isArray(eleEnable) || eleEnable instanceof NodeList
					? Array.from(eleEnable)
					: [];

			elements.forEach(ele => {
				if (!ele) return;

				const baseClassHidden = `is-a11y-${module}-hidden`;
				const baseClassFixed = `is-a11y-${module}-fixed`;
				const baseClassTags = `is-a11y-${module}-tags`;
				const baseClassTabindex = `is-a11y-${module}-tabindex`;

				if (ele.classList.contains(baseClassHidden)) {
					ele.removeAttribute('aria-hidden');
					ele.classList.remove(baseClassHidden);
				} else {
					ele.classList.remove(baseClassFixed);
				}

				const focusTags = ele.querySelectorAll(`.${baseClassTags}`);
				const tab0 = ele.querySelectorAll(`.${baseClassTabindex}`);
				const tabM1 = ele.querySelectorAll(`.${baseClassFixed}`);

				focusTags.forEach(tag => {
					tag.removeAttribute('tabindex');
					tag.classList.remove(baseClassTags);
				});
				tab0.forEach(tag => {
					tag.setAttribute('tabindex', '0');
					tag.classList.remove(baseClassTabindex);
				});
				tabM1.forEach(tag => {
					tag.classList.remove(baseClassFixed);
				});
			});
		},
  },

  util: {
		/**
		 * 지정된 요소를 slideDown 애니메이션으로 표시합니다. (jQuery slideDown 유사)
		 * @param {HTMLElement} el - 애니메이션을 적용할 요소
		 * @param {number} [duration=350] - 애니메이션 지속 시간 (ms)
		 */
		slideDown: function(el, duration = 350) {
			if (!el) return;

			el.style.removeProperty('display');
			let display = window.getComputedStyle(el).display;
			if (display === 'none') display = 'block';
			el.style.display = display;

			const height = el.offsetHeight;

			el.style.overflow = 'hidden';
			el.style.height = 0;
			el.offsetHeight; // 강제 리플로우

			el.classList.remove('collapse', 'show');
			el.classList.add('collapsing');

			el.style.transition = `height ${duration}ms ease`;
			el.style.height = `${height}px`;

			setTimeout(() => {
				el.classList.remove('collapsing');
				el.classList.add('collapse', 'show');
				el.style.removeProperty('height');
				el.style.removeProperty('overflow');
				el.style.removeProperty('transition');
			}, duration);
		},

		/**
		 * 지정된 요소를 slideUp 애니메이션으로 숨깁니다. (jQuery slideUp 유사)
		 * @param {HTMLElement} el - 애니메이션을 적용할 요소
		 * @param {number} [duration=350] - 애니메이션 지속 시간 (ms)
		 */
		slideUp: function(el, duration = 350) {
			if (!el) return;

			el.style.height = `${el.offsetHeight}px`;
			el.offsetHeight; // 강제 리플로우

			el.style.overflow = 'hidden';
			el.style.transition = `height ${duration}ms ease`;

			el.classList.remove('collapse', 'show');
			el.classList.add('collapsing');

			el.style.height = 0;

			setTimeout(() => {
				el.classList.remove('collapsing');
				el.classList.add('collapse');
				el.style.display = 'none';
				el.style.removeProperty('height');
				el.style.removeProperty('overflow');
				el.style.removeProperty('transition');
			}, duration);
		},
		
		/**
		 * 현재 날짜를 'YYYYMMDD' 형식의 문자열로 반환합니다.
		 * 
		 * 주로 캐시 무효화를 위한 버전 파라미터로 사용할 수 있으며,
		 * 매일 자정에 값이 변경됩니다. (ex: '20250930')
		 *
		 * @function
		 * @returns {string} 'YYYYMMDD' 형식의 날짜 문자열
		 *
		 * @example
		 * const version = getVersion(); // '20250930'
		 * const url = `header.js?v=${version}`;
		 */
		getVersion: function () {
			const d = new Date();
			return `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`;
		},

		/**
		 * 요소의 속성(attr)에 날짜 기반 난수 쿼리 추가
		 * @param {HTMLElement|HTMLElement[]|NodeList} elements
		 * @param {string} attr
		*/
		setAttrRandomNum: function(elements, attr) {
			const list = elements instanceof HTMLElement ? [elements] : Array.from(elements || []);
			const rand = UI.util.getVersion();

			list.forEach(el => {
				let val = el.getAttribute(attr);
				if (!val) return;

				// 기존에 이미 ? 또는 &로 붙은 날짜 기반 쿼리 제거
				val = val.replace(/([?&])\d{8}$/, ''); // YYYYMMDD 형식 숫자 제거

				const sep = val.includes('?') ? '&' : '?';
				el.setAttribute(attr, `${val}${sep}${rand}`);
			});
		},

    /**
		 * URL에서 특정 쿼리 파라미터 값을 가져옴
		 * @param {string} param - 파라미터 이름
		 * @param {string} [url=location.href] - 검사할 URL (기본값: 현재 페이지 URL)
		 * @returns {string|null} - 파라미터 값 또는 null
		*/
		getUrlParam: function(param, url = window.location.href) {
			if (!param) return null;

			try {
				const urlObj = new URL(url);
				return urlObj.searchParams.get(param);
			} catch (e) {
				console.error('잘못된 URL:', url);
				return null;
			}
		},

    /**
		 * 스크롤 이동 후 콜백 실행 (jQuery animate 대체)
		 * @param {number} targetY - 이동할 Y 위치
		 * @param {number} duration - 애니메이션 시간 (ms)
		 * @param {Function} callback - 완료 후 실행할 콜백
		 */
		scrollToWithCallback: function(targetY, duration = 500, callback) {
			const start = window.scrollY || window.pageYOffset;
			const startTime = performance.now();

			function scroll() {
				const now = performance.now();
				const time = Math.min(1, (now - startTime) / duration);
				const easeOut = time * (2 - time); // easeOutQuad
				window.scrollTo(0, Math.ceil((easeOut * (targetY - start)) + start));

				if (time < 1) {
					requestAnimationFrame(scroll);
				} else if (typeof callback === 'function') {
					callback(); // 스크롤 완료 후 실행
				}
			}

			requestAnimationFrame(scroll);
		},
  },

  formatter: {
    /**
     * 숫자 문자열에서 모든 콤마(,)를 제거합니다.
     * @param {string} str - 콤마를 제거할 문자열
     * @returns {string} 콤마가 제거된 문자열
     */
    removeCommas: (str) => str.replace(/,/g, ""),

    /**
     * 숫자에 천 단위 콤마(,)를 추가합니다.
     * @param {number|string} num - 콤마를 추가할 숫자 또는 숫자 문자열
     * @returns {string} 콤마가 추가된 문자열
     */
    addCommas: (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    
    /**
     * 숫자를 지정한 소수점 자리수까지 반올림합니다.
     * @param {number} num - 반올림할 숫자
     * @param {number} decimalPlaces - 소수점 자리수
     * @returns {string} 반올림된 숫자 문자열
     */
    roundTo: (num, decimalPlaces) => {
      return num.toFixed(decimalPlaces);
    },

    /**
     * 문자열 양쪽의 공백을 제거합니다.
     * @param {string} str - 공백을 제거할 문자열
     * @returns {string} 공백이 제거된 문자열
     */
    trimSpaces: (str) => str.trim(),

    /**
     * 문자열을 지정된 길이만큼 자르고, 초과 시 "..."을 붙입니다.
     * @param {string} str - 자를 문자열
     * @param {number} length - 최대 길이
     * @returns {string} 잘린 문자열 또는 원본 문자열
    */
    truncate: (str, length) => {
      if (str.length > length) {
        return str.slice(0, length) + "...";
      }
      return str;
    },

    /**
     * 문자열에서 영문자, 숫자, 공백을 제외한 모든 특수 문자를 제거합니다.
     * @param {string} str - 특수 문자를 제거할 문자열
     * @returns {string} 특수 문자가 제거된 문자열
     */
    removeSpecialChars: (str) => {
      return str.replace(/[^a-zA-Z0-9 ]/g, '');
    },

    /**
     * 날짜를 "YYYY-MM-DD" 형식의 문자열로 포맷합니다.
     * @param {Date|string|number} date - Date 객체 또는 날짜로 변환 가능한 값
     * @returns {string} 포맷된 날짜 문자열 (예: "2025-09-26")
     */
    formatDate: (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    /**
     * 이메일 형식이 유효한지 검사합니다.
     * @param {string} email - 검사할 이메일 주소
     * @returns {boolean} 유효하면 true, 아니면 false
     */
    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  },

	input: {
    /**
     * input 관련 초기화 함수들을 호출합니다.
     * 보통 페이지 로드 시 한 번 실행합니다.
     */
    init: function () {
      this.reset();
      this.bindFocusState();
    },

    /**
     * input 요소에 값이 있고 포커스가 있는 경우에만 초기화 버튼을 보여줍니다.
     */
    toggleResetButton: function (input) {
      const wrapper = input.closest('.form_input');
      const resetButton = wrapper?.querySelector('.btn_input_reset');

      if (!resetButton) return;

      if (document.activeElement === input && input.value.trim() !== '') {
        resetButton.classList.add('visible');  // 리셋 버튼 노출
      } else {
        resetButton.classList.remove('visible'); // 리셋 버튼 숨김
      }
    },

    /**
     * `.btn_input_reset` 버튼 클릭 시 인접한 input 값을 초기화하고 포커스를 이동합니다.
     */
    reset: function () {
      const resetButtons = document.querySelectorAll('.btn_input_reset');

      resetButtons.forEach((btn) => {
        btn.addEventListener('click', function () {
          const input = btn.closest('.form_input')?.querySelector('.form_control');
          if (input) {
            input.value = '';
            input.focus();
            btn.classList.remove('visible'); // 리셋 버튼 숨김
          }
        });
      });
    },

    /**
     * wrapper 내부에 포커스가 완전히 사라졌을 때
     * focused / visible 클래스를 제거합니다.
     */
    handleFocusOut: function (wrapper) {
      setTimeout(() => {
        const active = document.activeElement;
				console.log(active)
        if (!wrapper.contains(active)) {
          wrapper.classList.remove('focused');
          const resetButton = wrapper.querySelector('.btn_input_reset');
          if (resetButton) {
            resetButton.classList.remove('visible');
          }
        }
      }, 0);
    },

    /**
     * input 요소에 포커스되면 `.form_input`에 'focused' 클래스 추가,
     * 포커스 해제되면 제거. 입력값에 따라 리셋 버튼 제어.
     */
    bindFocusState: function () {
      const inputs = document.querySelectorAll('.form_control');

      inputs.forEach((input) => {
        const wrapper = input.closest('.form_input');
        if (!wrapper) return;

        const resetButton = wrapper.querySelector('.btn_input_reset');

        // input에 포커스: focused 클래스 추가 및 리셋 버튼 토글
        input.addEventListener('focus', () => {
          wrapper.classList.add('focused');
          UI.input.toggleResetButton(input);
        });

        // input에서 포커스 빠짐: wrapper 전체의 포커스 상태 확인
        input.addEventListener('blur', () => {
          UI.input.handleFocusOut(wrapper);
        });

        // btn에서 포커스 빠짐: wrapper 전체의 포커스 상태 확인
				wrapper.querySelector('.btn')?.addEventListener('blur', () => {
          UI.input.handleFocusOut(wrapper);
        });

        // 입력 중: 리셋 버튼 표시 상태 업데이트
        input.addEventListener('input', () => {
          UI.input.toggleResetButton(input);
        });

        // 리셋 버튼 관련 이벤트
        if (resetButton) {
          // 버튼 포커스: focused 유지
          resetButton.addEventListener('focus', () => {
            wrapper.classList.add('focused');
          });

          // 버튼 blur: wrapper 외부로 나가면 focused 제거
          resetButton.addEventListener('blur', () => {
            UI.input.handleFocusOut(wrapper);
          });
        }
      });
    },
  },

  modal: {
    /**
     * 기본 z-index 값을 가져온다.
     * @param {HTMLElement} modal - 대상 모달 엘리먼트
     * @returns {number} - z-index 값 (숫자)
    */
    getBaseZIndex(modal) {
      const z = window.getComputedStyle(modal).zIndex;
      return isNaN(parseInt(z)) ? 0 : parseInt(z);
    },

		/**
		 * 모달 열기
		 * @param {string} target - 열 대상 모달 선택자
		 * @param {HTMLElement} btn - 트리거 버튼 (포커스 복원용)
    */
		open: function(target, btn) {
			const modal = document.querySelector(target);
			const openedModal = document.querySelectorAll('.modal.active');

			modal.setAttribute('aria-modal', 'true');
			setTimeout(() => modal.focus(), 1);
			modal.classList.add('visible');
			setTimeout(() => modal.classList.add('active'), 100);

			modal.setAttribute('role', modal.classList.contains('alert') ? 'alertdialog' : 'dialog');

			if (openedModal.length > 0) {
        const baseZ = this.getBaseZIndex(modal);
				modal.style.zIndex = baseZ + openedModal.length;
			}

			btn.setAttribute('data-modal', target);

			const modalBody = modal.querySelector('.modal_body');
			const contentHeight = modalBody.scrollHeight;
			const visibleHeight = modalBody.clientHeight;
			if (contentHeight > visibleHeight) {
				modalBody.setAttribute('tabindex', '0');
			} else {
				modalBody.removeAttribute('tabindex');
			}

			if (!btn.closest('.modal')) {
				UI.a11y.accessDisable(UI.dom.prevAll(modal), 'modal');
			} else {
				UI.a11y.accessDisable(btn.closest('.modal'), 'modal');
			}
		},

		/**
		 * 모달 닫기
		 * @param {string} target - 닫을 모달 선택자
    */
		close: function(target) {
			const modal = document.querySelector(target);
			const openedBtn = document.querySelector(`[data-modal="${target}"]`);
			const openedModal = document.querySelectorAll('.modal.active');

			modal.classList.remove('active');
			setTimeout(() => modal.classList.remove('visible'), 100);

			if (openedModal.length > 1) {
				UI.a11y.accessEnable(openedBtn.closest('.modal'), 'modal');
			} else {
				UI.a11y.accessEnable(UI.dom.prevAll(modal), 'modal');
			}

			setTimeout(() => openedBtn.focus(), 300);
			openedBtn.removeAttribute('data-modal');
			modal.removeAttribute('aria-modal');
		},
	},

  toast: {
    show: () => {},
    hide: () => {},
  },

	tooltip: {
		// 툴팁과 버튼 사이 간격 (px)
		TOOLTIP_GAP: 4,
		
		/**
		 * 툴팁 기능 초기화
		 *
		 * - 클릭 이벤트를 통해 툴팁 토글
		 * - 창 리사이즈 시 툴팁 제거
		 * - HTML 내에 미리 존재하는 DOM 요소 기반으로 작동
		 *
		 * @function
		*/
		init: function () {
			document.addEventListener('click', (e) => {
				const trigger = e.target.closest('[data-tooltip-target]');
				if (trigger) {
					e.preventDefault();
					UI.tooltip.toggle(trigger);
				} else {
					UI.tooltip.hideAll();
				}
			});

			window.addEventListener('resize', UI.tooltip.hideAll);
		},

		/**
		 * 트리거 요소를 클릭했을 때 툴팁을 토글합니다.
		 *
		 * - 이미 열린 툴팁이면 닫고
		 * - 닫혀 있으면 열고 위치 계산 후 표시
		 *
		 * @param {HTMLElement} trigger - 툴팁을 트리거하는 요소 (data-tooltip-target 속성 필요)
		*/
		toggle: function (trigger) {
			const targetSelector = trigger.dataset.tooltipTarget;
			if (!targetSelector) return;

			const tooltip = document.querySelector(targetSelector);
			if (!tooltip) return;

			// 이미 열려 있다면 닫기
			if (tooltip.classList.contains('is_active')) {
				UI.tooltip.hideAll();
				return;
			}

			// 다른 툴팁 닫고 현재 툴팁 표시
			UI.tooltip.hideAll();
			UI.tooltip.show(trigger, tooltip);
		},

		/**
		 * 트리거 요소에 맞게 툴팁 요소를 보여주고 위치를 설정합니다.
		 *
		 * @param {HTMLElement} trigger - 툴팁을 트리거한 버튼/요소
		 * @param {HTMLElement} tooltip - 보여줄 툴팁 DOM 요소
		*/
		show: function (trigger, tooltip) {
			const wrapper = trigger.closest('.tooltip_wrap');
			if (!wrapper) return;

			// data-position, data-align 읽기 (default align: center)
			// 속성이 없는 경우 기본값 top / center
			const position = tooltip.dataset.tooltipPosition || 'top';
			const align = tooltip.dataset.tooltipAlign || 'center';

			const triggerRect = trigger.getBoundingClientRect();
			const wrapperRect = wrapper.getBoundingClientRect();
			const tooltipRect = tooltip.getBoundingClientRect();

			// wrapper 기준 상대좌표
			const relativeTop = triggerRect.top - wrapperRect.top;
			const relativeLeft = triggerRect.left - wrapperRect.left;

			const gap = this.TOOLTIP_GAP;

			let top = 0;
			let left = 0;

			switch (position) {
				case 'top':
					top = relativeTop - tooltipRect.height - gap;
					switch (align) {
						case 'start':
							left = relativeLeft;
							break;
						case 'end':
							left = relativeLeft + triggerRect.width - tooltipRect.width;
							break;
						case 'center':
						default:
							left = relativeLeft + (triggerRect.width / 2) - (tooltipRect.width / 2);
							break;
					}
					break;

				case 'bottom':
					top = relativeTop + triggerRect.height + gap;
					switch (align) {
						case 'start':
							left = relativeLeft;
							break;
						case 'end':
							left = relativeLeft + triggerRect.width - tooltipRect.width;
							break;
						case 'center':
						default:
							left = relativeLeft + (triggerRect.width / 2) - (tooltipRect.width / 2);
							break;
					}
					break;

				case 'left':
					left = relativeLeft - tooltipRect.width - gap;
					switch (align) {
						case 'start':
							top = relativeTop;
							break;
						case 'end':
							top = relativeTop + triggerRect.height - tooltipRect.height;
							break;
						case 'center':
						default:
							top = relativeTop + (triggerRect.height / 2) - (tooltipRect.height / 2);
							break;
					}
					break;

				case 'right':
					left = relativeLeft + triggerRect.width + gap;
					switch (align) {
						case 'start':
							top = relativeTop;
							break;
						case 'end':
							top = relativeTop + triggerRect.height - tooltipRect.height;
							break;
						case 'center':
						default:
							top = relativeTop + (triggerRect.height / 2) - (tooltipRect.height / 2);
							break;
					}
					break;
			}

			tooltip.style.top = `${top}px`;
			tooltip.style.left = `${left}px`;
			tooltip.classList.add('is_active');
			tooltip.setAttribute('aria-hidden', 'false');
		},

		/**
		 * 현재 열린 모든 툴팁을 닫고 위치 스타일을 초기화합니다.
		 *
		 * @function
		*/
		hideAll: function () {
			const openTooltips = document.querySelectorAll('.tooltip.is_active');
			openTooltips.forEach(tip => {
				tip.classList.remove('is_active');
				tip.style.top = '';
				tip.style.left = '';
			});
		}
	},

	tab : {
		// 스크롤 위치 인식 허용 오차 (px)
		SCROLL_THRESHOLD: 10,
		// 스크롤 이벤트 throttle 지연시간 (ms)
		THROTTLE_DELAY: 100,

		/**
		 * throttle 함수: 특정 시간 간격으로만 콜백 실행
		 * @param {Function} fn 실행할 함수
		 * @param {number} wait 대기 시간 (밀리초)
		 * @returns {Function} throttle된 함수
		 */
		throttle: function(fn, wait) {
			let lastTime = 0;
			return function (...args) {
				const now = Date.now();
				if (now - lastTime >= wait) {
					lastTime = now;
					fn.apply(this, args);
				}
			};
		},

		/**
		 * 페이지 내 모든 탭 컨테이너 초기화
		 */
		initAll: function() {
			const containers = document.querySelectorAll('.tab');
			containers.forEach(container => this.init(container));
		},

		/**
		 * 개별 탭 컨테이너 초기화
		 * @param {HTMLElement} container 탭 컨테이너 요소
		 */
		init: function(container) {
			if (!container) return;

			const isScrollTab = container.hasAttribute('data-tab-scroll'); // 스크롤 연동 탭 여부
			const tabContainer = container.querySelector('.tab_container'); // 탭 버튼 그룹 컨테이너
			const tabsBtns = container.querySelector('.tab_container').querySelectorAll('.tab_btn'); // 개별 탭 버튼들
			const tabContent = container.querySelector('.tab_content');
			const tabPanes = tabContent ? Array.from(tabContent.children).filter(el => el.classList.contains('tab_pane')) : []; // 탭 내용 패널들
			const tabIndicator = container.querySelector('.tab_indicator'); // 하단 이동 표시 

			if (!tabsBtns.length || !tabPanes.length) return; // 탭 또는 패널 없으면 종료

			// 스크롤 연동 탭이면 모든 패널 항상 표시 (숨기지 않음)
			if (isScrollTab) {
				tabPanes.forEach(pane => {
					pane.classList.add('active');
				});
			}

			// swiper가 필요한 경우 초기화하고 swiper 인스턴스 반환
			const swiperInstance = this.initSwiper(container, tabContainer);

			// 키보드 네비게이션 이벤트 위임 설정 (컨테이너 단위)
			this.setupKeyboardNavigation(tabsBtns, container);

			// 클릭 이벤트 위임 설정
			this.setupClickHandler(container, tabsBtns, tabPanes, tabIndicator, isScrollTab, swiperInstance);

      // HTML data 속성에서 초기 활성 탭 인덱스 읽기 (기본값 0)
      const activeIndex = parseInt(container.getAttribute('data-tab-active')) || 0;
      this.activateTab(tabsBtns, tabPanes, activeIndex, tabIndicator, isScrollTab);
		},

		/**
		 * Swiper 초기화 함수
		 * - data-tab-swiper 속성이 있는 경우 자동으로 swiper 관련 클래스 추가 및 Swiper 인스턴스 초기화
		 * @param {HTMLElement} container 탭 컨테이너 요소
		 * @param {HTMLElement} tabContainer 탭 버튼 그룹 요소 (.tab_container)
		 * @returns {Swiper|null} Swiper 인스턴스 또는 null
		 */
		initSwiper: function(container, tabContainer) {
			// swiper 활성화 조건 확인: data-tab-swiper 속성이 없으면 처리하지 않음
			if (!container.hasAttribute('data-tab-swiper')) return null;

			// 1. 탭 버튼 그룹 (.tab_group) 찾기
			const tabsGroup = tabContainer.querySelector('.tab_group');

			// 2. .tabs_group에 swiper-wrapper 클래스 자동 추가
			if (tabsGroup && !tabsGroup.classList.contains('swiper-wrapper')) {
				tabsGroup.classList.add('swiper-wrapper');
			}

			// 3. 각 탭 항목 (.tab_item)에 swiper-slide 클래스 자동 추가
			const tabItems = tabsGroup ? tabsGroup.querySelectorAll('.tab_item') : [];
			tabItems.forEach(item => {
				if (!item.classList.contains('swiper-slide')) {
					item.classList.add('swiper-slide');
				}
			});

			// 5. Swiper 인스턴스 생성
			const swiper = new Swiper(tabContainer, {
				slidesPerView: 'auto', // 자동 너비 슬라이드 (탭 개수/길이 따라감)
				// 추가 옵션 필요 시 여기에 작성 가능 (예: spaceBetween, loop 등)
			});

			// 6. 컨테이너에 swiper 인스턴스 저장 (재사용 목적)
			container._swiperInstance = swiper;

			// 7. 생성된 인스턴스 반환
			return swiper;
		},


		/**
		 * 탭 활성화 함수 - 버튼과 패널 상태를 동기화
		 * @param {NodeListOf<HTMLElement>} tabsBtns 탭 버튼 리스트
		 * @param {NodeListOf<HTMLElement>} panes 탭 내용 패널 리스트
		 * @param {number} idx 활성화할 탭 인덱스
		 * @param {HTMLElement|null} tabIndicator 하단 활성 표시 요소
		 * @param {boolean} isScrollTab 스크롤 연동 탭인지 여부
		 */
		activateTab: function(tabsBtns, panes, idx, tabIndicator, isScrollTab = false) {
			tabsBtns.forEach((tabBtn, i) => {
				const isActive = i === idx;
				tabBtn.classList.toggle('active', isActive);
				tabBtn.setAttribute('aria-selected', isActive ? 'true' : 'false'); // 접근성용 aria-selected 설정
				tabBtn.setAttribute('tabindex', isActive ? '0' : '-1'); // 포커스 순서 관리
			});

			panes.forEach((pane, i) => {
				if (!isScrollTab) {
					// 일반 탭 - 선택된 페인만 보이도록 설정
					pane.classList.toggle('active', i === idx);
					pane.hidden = i !== idx;
					pane.setAttribute('aria-hidden', i !== idx ? 'true' : 'false');
				} else {
					// 스크롤 연동 탭은 항상 보임, aria-hidden 속성만 설정
					pane.setAttribute('aria-hidden', 'false');
				}
			});

			if (tabIndicator && tabsBtns[idx]) {
				const tabBtn = tabsBtns[idx];
				// 하단 표시바 위치와 너비 변경 (애니메이션 효과 있음)
				tabIndicator.style.width = `${tabBtn.offsetWidth}px`;
				tabIndicator.style.left = `${tabBtn.offsetLeft}px`;
			}
		},

		/**
		 * Swiper 슬라이드 이동 함수
		 * @param {Swiper|null} swiperInstance swiper 인스턴스
		 * @param {number} idx 이동할 슬라이드 인덱스
		 */
		slideToSwiper: function(swiperInstance, idx, tabsBtns) {
			if (swiperInstance) {
				swiperInstance.slideTo(idx);
			}
		},

		/**
		 * 키보드 네비게이션 (화살표, 엔터/스페이스) 이벤트 위임 설정
		 * @param {NodeListOf<HTMLElement>} tabsBtns 탭 버튼 리스트
		 * @param {HTMLElement} container 탭 컨테이너 요소
		 */
		setupKeyboardNavigation: function(tabsBtns, container) {
			container.addEventListener('keydown', (e) => {
				const target = e.target;
				// 탭 버튼에서만 동작
				if (!target.classList.contains('tab_btn')) return;

				const tabsArray = Array.from(tabsBtns);
				const idx = tabsArray.indexOf(target);
				if (idx === -1) return;

				let newIdx = idx;

				if (e.key === 'ArrowRight') {
					e.preventDefault();
					newIdx = (idx + 1) % tabsArray.length; // 오른쪽 화살표: 다음 탭으로 이동 (순환)
					tabsArray[newIdx].focus();
				} else if (e.key === 'ArrowLeft') {
					e.preventDefault();
					newIdx = (idx - 1 + tabsArray.length) % tabsArray.length; // 왼쪽 화살표: 이전 탭으로 이동 (순환)
					tabsArray[newIdx].focus();
				} else if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					target.click(); // 엔터나 스페이스 누르면 해당 탭 클릭 이벤트 발생
				}
			});
		},

		/**
		 * 클릭 이벤트 위임 설정
		 * @param {HTMLElement} container 탭 컨테이너 요소
		 * @param {NodeListOf<HTMLElement>} tabsBtns 탭 버튼 리스트
		 * @param {NodeListOf<HTMLElement>} tabPanes 탭 내용 패널 리스트
		 * @param {HTMLElement|null} tabIndicator 하단 활성 표시 요소
		 * @param {boolean} isScrollTab 스크롤 연동 탭 여부
		 * @param {Swiper|null} swiperInstance swiper 인스턴스
		 */
		setupClickHandler: function(container, tabsBtns, tabPanes, tabIndicator, isScrollTab, swiperInstance) {
			const tabsGroup = tabsBtns[0].closest('.tab_container');
			const tabsHeight = tabsGroup ? tabsGroup.offsetHeight : 0;

			// 스크롤 연동 탭일 경우 스크롤 상태 관리용 객체
			let scrollState = {
				isScrollingByClick: false,
				scrollTargetIdx: null,
			};

			// 컨테이너 단위 클릭 이벤트 위임
			container.addEventListener('click', (e) => {
				const target = e.target;
				if (!target.classList.contains('tab_btn')) return;

				const tabsArray = Array.from(tabsBtns);
				const idx = tabsArray.indexOf(target);
				if (idx === -1) return;

				if (isScrollTab) {
					// 스크롤 연동 탭 클릭 시 스크롤 이동 트리거 및 상태 갱신
					scrollState.isScrollingByClick = true;
					scrollState.scrollTargetIdx = idx;

					const pane = tabPanes[idx];
					const paneRect = pane.getBoundingClientRect();
					const scrollY = window.scrollY || window.pageYOffset;
					const offset = UI.dom.getOffsetHeight('header'); // fixed header 높이 보정 포함
					const targetY = paneRect.top + scrollY - tabsHeight - offset; // 탭 높이만큼 오프셋 보정

					// 스크롤 이동 전 활성화
					// this.activateTab(tabsBtns, tabPanes, idx, tabIndicator, true);
					// this.slideToSwiper(swiperInstance, idx);
					
					UI.util.scrollToWithCallback(targetY, 500, () => {
						// 스크롤 이동 후 활성화
						this.activateTab(tabsBtns, tabPanes, idx, tabIndicator, true);
						this.slideToSwiper(swiperInstance, idx);

						if (typeof window.onTabScrollComplete === 'function') {
							window.onTabScrollComplete(idx, pane);
						}

						// 스크롤 상태 초기화
						scrollState.isScrollingByClick = false;
						scrollState.scrollTargetIdx = null;
					});
				} else {
					// 일반 탭 클릭 시 즉시 탭 활성화
					this.activateTab(tabsBtns, tabPanes, idx, tabIndicator);
					this.slideToSwiper(swiperInstance, idx);
				}
			});

			// 스크롤 이벤트를 throttle 적용해서 등록 (스크롤 연동 탭에만)
			if (isScrollTab) {
				window.addEventListener(
					'scroll',
					this.throttle(() => {
						this.handleScrollNavigation(tabsBtns, tabPanes, tabIndicator, scrollState, swiperInstance);
					}, this.THROTTLE_DELAY)
				);
			}
		},

		/**
		 * 스크롤 위치에 따른 탭 활성화 처리 함수
		 * @param {NodeListOf<HTMLElement>} tabsBtns 탭 버튼 리스트
		 * @param {NodeListOf<HTMLElement>} panes 탭 내용 패널 리스트
		 * @param {HTMLElement|null} tabIndicator 하단 활성 표시 요소
		 * @param {Object} scrollState 스크롤 상태 객체
		 * @param {Swiper|null} swiperInstance swiper 인스턴스 (추가)
		 */
		handleScrollNavigation: function(tabsBtns, panes, tabIndicator, scrollState, swiperInstance) {
			const { isScrollingByClick, scrollTargetIdx } = scrollState;
			const tabsEl = tabsBtns[0].closest('.tab').querySelector('.tab_container');
			const tabsHeight = tabsEl ? tabsEl.offsetHeight : 0;

			// 클릭에 의한 스크롤 이동 중이면, 목표 위치 근처 도달 여부 체크
			if (isScrollingByClick && scrollTargetIdx !== null) {
				const pane = panes[scrollTargetIdx];
				const paneTop = pane.getBoundingClientRect().top;
				if (Math.abs(paneTop - tabsHeight) <= this.SCROLL_THRESHOLD) {
					// 목표 위치 도달하면 스크롤 이동 상태 초기화
					scrollState.isScrollingByClick = false;

					// swiper도 해당 탭으로 슬라이드 이동 추가
					this.slideToSwiper(swiperInstance, scrollTargetIdx);

					// 외부 콜백 함수 호출 (존재 시)
					if (typeof window.onTabScrollComplete === 'function') {
						window.onTabScrollComplete(scrollTargetIdx, pane);
					}

					scrollState.scrollTargetIdx = null;
					// 탭 활성화 상태 재설정 (aria 등 갱신)
					this.activateTab(tabsBtns, panes, scrollTargetIdx, tabIndicator, true);
				}
				return; // 클릭 스크롤 중엔 아래 일반 스크롤 처리 로직 건너뜀
			}

			// 클릭 이동이 아닐 때는 현재 스크롤 위치에 가장 가까운 패널 찾기
			let foundIdx = 0;
			let minDiff = Infinity;
			const tabsBottom = tabsEl.getBoundingClientRect().bottom;

			panes.forEach((pane, idx) => {
				const rect = pane.getBoundingClientRect();
				const diff = Math.abs(rect.top - tabsBottom);
				// 탭 하단 근처 위치를 기준으로 가장 가까운 패널 선택
				if (rect.top - tabsBottom <= this.SCROLL_THRESHOLD && diff < minDiff) {
					minDiff = diff;
					foundIdx = idx;
				}
			});

			// 스크롤 위치 기준으로 탭 활성화 갱신
			this.activateTab(tabsBtns, panes, foundIdx, tabIndicator, true);

			// swiper 슬라이드 위치도 갱신 (추가)
			this.slideToSwiper(swiperInstance, foundIdx);
		},
	},

	accordion : {
		/**
		 * 초기화: 모든 아코디언 버튼에 이벤트 바인딩
		 */
		init: function () {
			const accordionBtns = document.querySelectorAll('.accordion_button');
			accordionBtns.forEach(btn => {
				btn.addEventListener('click', (e) => {
					this.toggle(e.target);
				});
			});
		},

		/**
		 * 아코디언 토글 동작 처리
		 * @param {HTMLElement} target - 클릭된 버튼 요소
		 */
		toggle: function (target) {
			const self = target;
			const accordion = self.closest('.accordion');
			const accBtns = accordion.querySelectorAll('.accordion-button');
			const accItem = self.closest('.accordion-item');
			const accSiblings = UI.dom.getSiblings(accItem);
			const accCollapse = accordion.querySelector('#' + self.getAttribute('aria-controls'));

			const allowMultiple = accordion.hasAttribute('data-accordion-all');

			const isCollapsed = self.classList.contains('collapsed');

			if (isCollapsed) {
				UI.util.slideDown(accCollapse, 350);

				if (!allowMultiple) {
					// 단일 열림 모드일 때만 형제 아코디언 닫기
					accSiblings.forEach(sibling => {
						const sibCollapse = sibling.querySelector('.accordion-collapse');
						const sibButton = sibling.querySelector('.accordion-button');
						if (sibCollapse.classList.contains('show')) {
							UI.util.slideUp(sibCollapse, 350);
							this.hideHeader(sibButton);
						}
					});

					accBtns.forEach(btn => this.hideHeader(btn));
				}

				this.showHeader(self);
			} else {
				UI.util.slideUp(accCollapse, 350);
				this.hideHeader(self);
			}

			// 클릭한 아코디언 위치로 스크롤 이동
			setTimeout(() => {
				const accordionWrapper = self.closest('.accordion');
  
				// 스크롤 옵션 판단
				const hasScroll = !accordionWrapper.hasAttribute('data-accordion-no-scroll');

				if (hasScroll) {
					const scrollTargetY = this.getOffsetTopWithHeader(self);
					window.scroll({
						top: scrollTargetY,
						left: 0,
						behavior: 'smooth'
					});
				}
			}, 400);
		},

		getOffsetTopWithHeader: function (element) {
			const headerHeight = UI.dom.getOffsetHeight('#header');
			const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
			return elementTop - headerHeight;
		},

		/**
		 * 아코디언 헤더를 닫는 함수 (collapsed 추가)
		 * @param {HTMLElement} target
		 */
		hideHeader: function (target) {
			target.classList.add('collapsed');
			target.setAttribute('aria-expanded', 'false');
		},

		/**
		 * 아코디언 헤더를 여는 함수 (collapsed 제거)
		 * @param {HTMLElement} target
		 */
		showHeader: function (target) {
			target.classList.remove('collapsed');
			target.setAttribute('aria-expanded', 'true');
		},

		/**
		 * 아코디언 바디 보이기
		 * @param {HTMLElement} element
		 * @param {number} duration
		 */
		showCollapse: function (element, duration = 350) {
			element.style.height = '0px';
			element.classList.add('collapsing');
			element.classList.remove('collapse');
			element.classList.remove('show');

			const height = element.scrollHeight;
			requestAnimationFrame(() => {
				element.style.transition = `height ${duration}ms ease`;
				element.style.height = `${height}px`;
			});

			setTimeout(() => {
				element.classList.remove('collapsing');
				element.classList.add('collapse');
				element.classList.add('show');
				element.style.height = '';
				element.style.transition = '';
			}, duration);
		},

		/**
		 * 아코디언 바디 숨기기
		 * @param {HTMLElement} element
		 * @param {number} duration
		 */
		hideCollapse: function (element, duration = 350) {
			element.style.height = `${element.scrollHeight}px`;
			element.style.transition = `height ${duration}ms ease`;

			requestAnimationFrame(() => {
				element.style.height = '0px';
			});

			element.classList.remove('collapse');
			element.classList.remove('show');
			element.classList.add('collapsing');

			setTimeout(() => {
				element.classList.remove('collapsing');
				element.classList.add('collapse');
				element.style.height = '';
				element.style.transition = '';
			}, duration);
		},
	},
};
