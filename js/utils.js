import { getListCardElement } from "./selectors.js";

import { listItem, CARD_COUNT } from "./constants.js";

// create timer
export function createTimer({ seconds = 0, minutes = 0, onChange }) {
  let intervalID = null;

  function start() {
    clear();

    let currentSecond = seconds;
    let currentMinute = minutes;

    intervalID = setInterval(() => {
      onChange?.(currentSecond, currentMinute);

      if (currentSecond == 60) {
        currentMinute++;
        currentSecond = 0;
      }

      currentSecond++;
    }, 1000);
  }

  function clear() {
    clearInterval(intervalID);
  }

  return {
    start,
    clear,
  };
}

// generate random img for card-container
export function generateCardContainer(gameContainer) {
  gameContainer.innerHTML = "";
  let newListItem = [...listItem];

  for (let i = 0; i < CARD_COUNT; i++) {
    if (newListItem.length === 0) newListItem = [...listItem];

    const randomIndex = Math.floor(Math.random() * newListItem.length);
    const randomElement = newListItem[randomIndex];

    const cardHTML = `<div class="card-container">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${randomElement.src}" class="image"/></div>
     </div>
     `;
    gameContainer.innerHTML += cardHTML;
    gameContainer.style.gridTemplateColumns = `repeat(${CARD_COUNT / 4},auto)`;
    newListItem.splice(randomIndex, 1);
  }
}

// highlight card container when match
export function highlightCardElement(firstSelection, secondSelection) {
  firstSelection.element.className = "card-container flipped";
  secondSelection.element.className = "card-container flipped";
  firstSelection.element.style.pointerEvents = "none";
  secondSelection.element.style.pointerEvents = "none";
}

// disable card container when not match
export function disableCardElement(firstSelection, secondSelection) {
  firstSelection.element.classList.remove("flipped");
  secondSelection.element.classList.remove("flipped");
  firstSelection.element.style.pointerEvents = "visible";
  secondSelection.element.style.pointerEvents = "visible";
}

// check win status
export function checkWin() {
  const cardList = getListCardElement();
  const cardListLength = Array.from(cardList).filter((x) =>
    x.classList.contains("flipped")
  ).length;

  return cardListLength === cardList.length;
}

// reset card status when win or lose
export function resetCardStatus() {
  const cardList = getListCardElement();
  cardList.forEach((card) => {
    card.classList.remove("flipped");
    card.style.pointerEvents = "visible";
  });
}
