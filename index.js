/*
 * Name: SunWoo Jang
 * Date: May 19, 2023
 * Section: IAB 6068
 *
 * 이 문서는 메인 자바스크립트 문서다. 현재는 TODO List의 이벤트 핸들러와
 * 이벤트 핸들러에 사용되는 함수들을 포함하고 있다.
 * TODO List는 todo 생성, 삭제와 관련된 함수들과
 * 그 안의 list의 생성, 삭제와 관련된 함수들로 나누었음
 */

'use strict';
(function () {
	window.addEventListener('load', init); // 페이지 load 되었을 때 init함수 실행

	function init() {
		// add 버튼 클릭 이벤트
		id('addBtn').addEventListener('click', addList);
		// 예시 리스트는 이벤트 설정 안되어있으니 여기서 설정해준다.
		// 예시로 적힌 Make TODO List의 Did 버튼 클릭 이벤트
		qs('.didBtn').addEventListener('click', e => clickDid(e));
		// 예시로 적힌 Make TODO List의 Remove 버튼 클릭 이벤트
		qs('.removeBtn').addEventListener('click', e => clickRemove(e));
		id('add-date').addEventListener('click', addTODO);
		id('delete-date').addEventListener('click', deleteList);

		// 오늘 날짜 출력
		let newDateSpan = document.createElement('span');
		newDateSpan.innerText = getDate(new Date());
		document.getElementsByClassName('date-container')[0].appendChild(newDateSpan);
	}

	/**
	 * list 관련 함수
	 */

	// list-container 추가 함수
	function addList() {
		const list = this.previousElementSibling;                   // id("list")
		const input = this.nextElementSibling;                      // id("inputText")
		const newli = document.createElement('li');                 // 새로운 li태그 생성

		const newspan = document.createElement('span');             // 새로운 span태그 생성
		newspan.innerText = input.value;                            // input값 넣어주기
		input.value = '';                                           // input값 초기화
		newli.appendChild(newspan);                                 // 새로운 li에 자식노드로 추가

		const didBtn = document.createElement('button');            // didBtn 생성
		didBtn.innerHTML = 'Did';
		didBtn.classList.add('didBtn');
		didBtn.addEventListener('click', e => clickDid(e));
		newli.appendChild(didBtn);

		const removeBtn = document.createElement('button');         // removeBtn 생성
		removeBtn.innerHTML = 'Remove';
		removeBtn.classList.add('removeBtn');
		removeBtn.addEventListener('click', e => clickRemove(e));
		newli.appendChild(removeBtn);

		list.appendChild(newli);                                    // 생성한 요소들 전부 추가
	}

   // Did 클릭 이벤트 함수
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

	// Remove 버튼을 눌렀을 때 list 삭제 함수
	function clickRemove(item) {
		item.target.parentNode.remove();
	}



	/**
	 * todo 생성, 삭제 관련 함수
	 */

	// 새로운 날의 to do list 추가 함수
	function addTODO() {
		let dateValue = id('date').value;
		if (dateValue !== '') {
			// 날짜를 고른 경우에만 실행
			const newTodoDiv = document.createElement('div');          // div 태그 생성
			const newDateContainerDiv = makeDateContainer(dateValue);  // dateValue값 사용해 컨테이너 생성
			const newUl = makeOrderList();                             // 새로운 list 생성
			const newAadButton = makeAddButton();                      // add 버튼 생성
			const newInputText = makeInputText();                      // text input 생성

			newTodoDiv.classList.add('todo');                          // todo class 추가

         // 위의 생성한 요소들 div에 추가
			newTodoDiv.appendChild(newDateContainerDiv);
			newTodoDiv.appendChild(newUl);
			newTodoDiv.appendChild(newAadButton);
			newTodoDiv.appendChild(newInputText);

         // todo-container에 새 todo 추가
			id('todo-container').appendChild(newTodoDiv);
		}
	}

	// date-container 생성 함수
	function makeDateContainer(dateValue) {
		const newTodoDiv = document.createElement('div');           // div 태그 생성
		newTodoDiv.classList.add('todo');                           // todo class 추가

		const newDateContainerDiv = document.createElement('div');  // div 태그 생성
		newDateContainerDiv.classList.add('date-container');        // date-container 추가

		const newDateDescriptionH3 = document.createElement('h3');  // h3 태그 생성
		newDateDescriptionH3.innerText = 'Date:';                   // Date 입력

		const newDateSpan = document.createElement('span');         // span 태그 생성
		newDateSpan.innerText = dateValue;                          // 날짜 입력

      // 생성된 요소들 date-container에 추가
		newDateContainerDiv.appendChild(newDateDescriptionH3);
		newDateContainerDiv.appendChild(newDateSpan);

		return newDateContainerDiv;
	}

	// 생성된 todo에 들어갈 list-container 생성 함수
	function makeOrderList() {
		const newUl = document.createElement('ul');
		newUl.classList.add('list-container');

		const newTodoLi = document.createElement('li');
		newUl.appendChild(newTodoLi);

		return newUl;
	}

	// input text을 입력받아 list-container에 추가해주는 버튼 생성 함수
	function makeAddButton() {
		const newAadButton = document.createElement('button');
		newAadButton.id = 'addBtn';
		newAadButton.textContent = 'Add';
		newAadButton.addEventListener('click', addList);

		return newAadButton;
	}

	// list-container에 추가하고 싶은 것을 입력받는 input form 생성 함수
	function makeInputText() {
		const newInputText = document.createElement('input');
		newInputText.type = 'text';
		newInputText.classList.add('inputText');

		return newInputText;
	}

	// todo 삭제 함수
	function deleteList() {
		let lastList = id('todo-container').lastElementChild;
		if (lastList != null) lastList.remove();
	}

	// 처음 load 시 date-container에 들어갈 date를 구해주는 함수
	function getDate(dateValue) {
		let currentTime = dateValue;
		let currentYear = currentTime.getFullYear();
		let currentMonth = currentTime.getMonth() + 1;
      // 1~9월까지는 0앞에 추가
		if (currentMonth < 10) {
			currentMonth = '0' + currentMonth;
		}
		let currentDay = currentTime.getDate();

		let currentDate = currentYear + '-' + currentMonth + '-' + currentDay;

		return currentDate;
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
})();
