import {
  getGameContainerElement,
  getControlContainer,
  getMovesCountElement,
  getResultElement,
  getStopGameButton,
  getStartButton,
  getTimeElement,
} from "./selectors.js";

import {
  createTimer,
  checkWin,
  resetCardStatus,
  generateCardContainer,
  highlightCardElement,
  disableCardElement,
} from "./utils.js";

let selections = [];
let movesCount = 0;
let timeClock = "00:00";
const timer = createTimer({
  seconds: 0,
  minutes: 0,
  onChange: handleOnChangeSeconds,
});

function handleOnChangeSeconds(seconds, minutes) {
  const timerText = getTimeElement();
  const fullSecond = `0${seconds}`.slice(-2);
  const fullMinute = `0${minutes}`.slice(-2);
  timeClock = `Time: ${fullMinute}:${fullSecond}`;
  timerText.textContent = timeClock;
}

function startTimer() {
  timer.start();
}

function handleStartButtonClick() {
  const startButton = getStartButton();
  const controlContainer = getControlContainer();
  const resultElement = getResultElement();
  const movesCount = getMovesCountElement();
  const timeElement = getTimeElement();
  const gameContainer = getGameContainerElement();
  if (!startButton) return;

  startButton.addEventListener("click", () => {
    controlContainer.classList.add("hide");
    resultElement.classList.add("hide");
    movesCount.textContent = "Moves: 0";
    timeElement.textContent = "Time: 00:00";
    startTimer();
    generateCardContainer(gameContainer);
    handleCardElementClick();
    resetCardStatus();
  });
}

function handleStopGameButtonClick() {
  const stopGameButton = getStopGameButton();
  const controlContainer = getControlContainer();
  const gameContainer = getGameContainerElement();
  if (!stopGameButton) return;

  stopGameButton.addEventListener("click", () => {
    selections = [];
    movesCount = 0;
    timeClock = "00:00";
    controlContainer.classList.remove("hide");
    gameContainer.innerHTML = "";
    gameContainer.removeEventListener("click", cardClickHandler, false);
  });
}

function handleWinGameStatus() {
  const resultElement = getResultElement();
  const controlContainer = getControlContainer();
  const gameContainer = getGameContainerElement();

  selections = [];
  timeClock = "00:00";
  controlContainer.classList.remove("hide");
  resultElement.classList.remove("hide");
  resultElement.innerHTML = `
  <h2>YOU WIN ❤️❤️❤️</h2>
  <h4>Moves: ${movesCount}</h4>
  `;
  movesCount = 0;
  gameContainer.innerHTML = "";
  gameContainer.removeEventListener("click", cardClickHandler, false);
}

function cardClickHandler(event) {
  const cardElement = event.target.closest(".card-container");
  if (!cardElement) return;

  const movesCountElement = getMovesCountElement();
  const cardSrc = cardElement.querySelector(".card-after img").src;
  cardElement.classList.toggle("flipped");
  cardElement.style.pointerEvents = "none";
  selections.push({ element: cardElement, src: cardSrc });

  if (checkWin()) {
    movesCount++;
    setTimeout(() => {
      handleWinGameStatus();
    }, 800);
    return;
  }

  if (selections.length === 2) {
    const [firstSelection, secondSelection] = selections;
    const firstSrc = firstSelection.src;
    const secondSrc = secondSelection.src;
    if (firstSrc === secondSrc) {
      movesCount++;
      movesCountElement.textContent = `Moves: ${movesCount}`;
      highlightCardElement(firstSelection, secondSelection);
    } else {
      movesCount++;
      movesCountElement.textContent = `Moves: ${movesCount}`;
      setTimeout(() => {
        disableCardElement(firstSelection, secondSelection);
      }, 500);
    }
    selections = [];
  }
}

function handleCardElementClick() {
  const gameContainer = getGameContainerElement();
  if (!gameContainer) return;

  gameContainer.removeEventListener("click", cardClickHandler, false);
  gameContainer.addEventListener("click", cardClickHandler);
}

(() => {
  handleStartButtonClick();
  handleStopGameButtonClick();
})();
