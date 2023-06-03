/*
 * Name: SunWoo Jang, JungHeum Woo
 * Date: June 02, 2023
 * Section: IAB 6068
 *
 * 이 문서는 퀴즈 자바스크립트 문서다. 현재는 퀴즈의 이벤트 핸들러와
 * 이벤트 핸들러에 사용되는 함수들을 포함하고 있다.
 * 사전 검색과 퀴즈 풀기 및 제출에 관한 함수들을 포함하고 있다.
 */
"use strict";
(function () {
  const QUIZ_URL = "https://opentdb.com/api.php?";
  let quizListIndex = 0;
  const DIC_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
  const DIC_KEY = "c7503280-faae-448c-b234-27841715cfe4";
  const THE_URL = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
  const THE_KEY = "da8f0ca5-89f7-4a23-af00-de4055b07f1b";

  window.addEventListener("load", init);

  function init() {
    id("start-quiz-button").addEventListener("click", fetchQuiz);
    id("search-button").addEventListener("click", fetchDictionary);
  }

  /* --- DICTIONARY API FUNCTIONS --- */

  async function fetchDictionary() {
    let input = id("input-word").value;                     // 값 가져옴
    let dictionaryBtn = id("dictionary-button").checked;    // Dictionary, Thesaurus 중 선택한 것
    let url = "";
    if (input !== "") {
      // 글자 넣은 경우 fetch
      if (dictionaryBtn) {
        url = DIC_URL + input + "?key=" + DIC_KEY;
      } else {
        url = THE_URL + input + "?key=" + THE_KEY;
      }

      await fetch(url)
      .then(checkStatus)
      .then(res => res.json())
      .then(getInfo)
      .catch(handleError);
    }
  }

  function getInfo(data) {
    id("search-result").innerHTML = "";                           // 결과부분 초기화
    for (let i = 0; i < data.length; i++) {
      if (i === 3) break;                                         // 최대 3개까지의 의미만 표시할 예정
      let newDiv = document.createElement("div");
      let word = document.createElement("h3");
      word.innerHTML = data[i].hwi.hw + " (" + data[i].fl + ")";  // 검색한 단어

      let newP = document.createElement("p");     
      newP.innerText = "";
      for (let j = 0; j < data[i].shortdef.length; j++) {
        newP.innerText = newP.innerText + data[i].shortdef[j];    // 뜻, 의미
      }

      newDiv.appendChild(word);
      newDiv.appendChild(newP);

      id("search-result").appendChild(newDiv);
    }
  }

  /* --- QUIZ API FUNCTIONS --- */

  function fetchQuiz() {
    let quizCount = id("quiz-count-setting").value;
    if (quizCount >= 1 && quizCount <= 50) {                      // 선택한 퀴즈 개수가 1~50이면 실행해라
      let url = QUIZ_URL + "amount=" + quizCount;
      let categoryValue = id("quiz-category-setting").value;
      let difficultyValue = id("quiz-difficulty-setting").value;
      let typeValue = id("quiz-type-setting").value;

      if (categoryValue !== "any")                                // 각 api 파라미터가 선택되었다면 주소에 추가해라
        url += "&category=" + categoryValue;
      if (difficultyValue !== "any")
        url += "&difficulty=" + difficultyValue;
      if (typeValue !== "any")
        url += "&type=" + typeValue;
      url += "&encode=url3986";                                   // 기본 html encodingdm로 가져오면 함수를
      fetch(url)                                                  // 따로 구현해야해서 url encoding으로
        .then(checkStatus)                                        // 가져오고 decodeURIComponent()으로
        .then(response => response.json())                        // string 리턴
        .then(gatherQuiz)
        .catch(handleError);
    }
  }

  function gatherQuiz(data) {
    let responseCode = data.response_code;
    let quiz_count = data.results.length;
    let quizList = [];
    if (responseCode === 0) {                                            // 성공적으로 퀴즈 리스트 따오면 실행
      for (let i = 0; i < quiz_count; i++) {
        let quizInfo = {
          category: decodeURIComponent(data.results[i].category),
          type: decodeURIComponent(data.results[i].type),
          difficulty: decodeURIComponent(data.results[i].difficulty),
          question: decodeURIComponent(data.results[i].question),
          correctAnswer: decodeURIComponent(data.results[i].correct_answer),
          incorrectAnswers: data.results[i].incorrect_answers            // 여기서 decoding하면
        }                                                                // string 리턴 되기때문에
        for (let j = 0; j < quizInfo.incorrectAnswers.length; j++)       // 아래에서 해줌
          quizInfo.incorrectAnswers[j] = decodeURIComponent(data.results[i].incorrect_answers[j])
        quizList.push(quizInfo);

      }
      id("quiz-setting-container").classList.add("hidden");
      id("quiz-appear-box").classList.remove("hidden");
      startQuiz(quizList);

    }
    else if (responseCode === 1) {                                        // option에 맞는 퀴즈의 갯수가
      showErrorMessage();                                                  // 부족하면 실행
    }
  }

  function showErrorMessage() {
    let newH3 = document.createElement("h3");
    newH3.innerText =
      "Sorry, The number of quizzes with the options you selected is less than you want."
      + " So we recommend you to change some options. This message disappears after 10 seconds";
    let container = id("quiz-setting-container");
    container.insertBefore(newH3, container.firstChild);
    setTimeout(function () {
      container.removeChild(container.firstChild);
    }, 10000);
  }

  function startQuiz(quizList) {
    if (quizListIndex < quizList.length) {
      let quizData = quizList[quizListIndex];

      id("quiz-question").innerText = quizData.question;
      id("quiz-category").innerText = quizData.category;
      id("quiz-difficulty").innerText = quizData.difficulty;

      let answerArr = quizData.incorrectAnswers.slice();                      // slice 안사용하면 
      let randomIndex = Math.floor((Math.random() * (answerArr.length + 1))); // quizData 값이 변함
      // 렌덤으로 0~3 index 줌
      answerArr.splice(randomIndex, 0, quizData.correctAnswer);               // 그 index로 정답 끼워넣음
      makeAnsButtons(answerArr, quizData.correctAnswer, quizList);
    } else {
      quizListIndex = 0;                                                      // 새 퀴즈 대비해서 초기화
      id("quiz-appear-box").classList.add("hidden");
      let newDiv = document.createElement("div");
      let newButton = document.createElement("button");
      let newH3 = document.createElement("h3");
      newH3.innerText = "Well done. you solved every quiz!"
        + " Press New quiz button if you want to start again.";
      newButton.innerText = "New quiz";
      newButton.addEventListener("click", newQuiz);                           // 누르면 새로운 퀴즈 준비

      newDiv.classList.add("end-game-container");

      newDiv.appendChild(newH3);
      newDiv.appendChild(newButton);
      id("quiz-container").appendChild(newDiv);
    }
  }

  function newQuiz() {
    let container = id("quiz-container");

    container.removeChild(container.lastChild);
    id("quiz-question").innerText = "";
    id("quiz-category").innerText = "";
    id("quiz-difficulty").innerText = "";
    id("quiz-ans-container").innerHTML = "";
    id("quiz-setting-container").classList.remove("hidden");
    id("quiz-appear-box").classList.add("hidden");
  }

  function makeAnsButtons(answerArr, correctAnswer, quizList) {
    for (let i = 0; i < answerArr.length; i++) {
      let newButton = document.createElement("button");
      newButton.innerText = answerArr[i];
      newButton.addEventListener("click", () => answerClicked(newButton.innerText, correctAnswer, quizList));
      id("quiz-ans-container").appendChild(newButton);
    }
  }

  function answerClicked(buttonText, correctAnswer, quizList) {
    if (buttonText === correctAnswer) {
      quizListIndex++;
    }
    id("quiz-ans-container").innerHTML = "";
    startQuiz(quizList);
  }


  /* --- HELP FETCHING FUNCTIONS --- */

  function handleError(err) {
    console.log(err);
  }

  function checkStatus(response) {
    if (!response.ok) {
      throw Error("Error in request: " + response.statusText);
    }
    return response; // a Response object
  }

  /* --- HELPER FUNCTIONS --- */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }
})();