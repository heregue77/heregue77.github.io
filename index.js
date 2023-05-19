/*
 * Name: SunWoo Jang
 * Date: May 19, 2023
 * Section: IAB 6068
 *
 * 문서 설명 필요
 */

'use strict';
(function () {
	window.addEventListener('load', init);

	function init() {
		// add 버튼 클릭 이벤트
		id('addBtn').addEventListener('click', addList);
		// 예시 리스트는 이벤트 설정 안되어있으니 여기서 설정해준다.
		// 예시로 적힌 Make TODO List의 Did 버튼 클릭 이벤트
		qs('.didBtn').addEventListener('click', e => clickDid(e));
		// 예시로 적힌 Make TODO List의 Remove 버튼 클릭 이벤트
		qs('.removeBtn').addEventListener('click', e => clickRemove(e));
	}

	function addList() {
		const list = id('list');
		const input = id('inputText');
		const newli = document.createElement('li');

		const newspan = document.createElement('span');
		newspan.innerText = input.value;
		input.value = '';
		newli.appendChild(newspan);

		const didBtn = document.createElement('button');
		didBtn.innerHTML = 'Did';
		didBtn.classList.add('didBtn');
		didBtn.addEventListener('click', e => clickDid(e));
		newli.appendChild(didBtn);

		const removeBtn = document.createElement('button');
		removeBtn.innerHTML = 'Remove';
		removeBtn.classList.add('removeBtn');
		removeBtn.addEventListener('click', e => clickRemove(e));
		newli.appendChild(removeBtn);

		list.appendChild(newli);
	}

	function clickDid(item) {
		// 같은 부모를 둔 span태그 선택
		let temp = item.target.parentNode.firstElementChild;
		// 만약 didList클래스가 있으면 삭제, 없으면 추가
		if (temp.classList.contains('didList')) {
			temp.classList.remove('didList');
		} else {
			temp.classList.add('didList');
		}
	}

	function clickRemove(item) {
		item.target.parentNode.remove();
	}

	/**
	 * --- HELPER FUNCTIONS ---
	 */
	/**
	 * Returns the element that has the ID attribute with the specified value.
	 * @param {string} name - element ID.
	 * @returns {object} - DOM object associated with id.
	 */
	function id(name) {
		return document.getElementById(name);
	}

	/**
	 * Returns the first element that matches the given CSS selector.
	 * @param {string} query - CSS query selector.
	 * @returns {object} - The first DOM object matching the query.
	 */
	function qs(query) {
		return document.querySelector(query);
	}

	/**
	 * Returns an array of elements matching the given query.
	 * @param {string} query - CSS query selector.
	 * @returns {array} - Array of DOM objects matching the given query.
	 */
	function qsa(query) {
		return document.querySelectorAll(query);
	}
})();
