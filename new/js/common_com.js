document.addEventListener('DOMContentLoaded', () => {
  UI.initAll();
});

const UI = {
  initAll: function() {

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

	tooltip: {
		/* 여기에 툴팁 로직 추가 */
	}

};
