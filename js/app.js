/*
 * Create a list that holds all of your cards
 */
const container = document.querySelector('.container');
const cards = document.getElementsByClassName('card');

replaceDeck();

let openCards = [];
let oldCard, newCard;
let moves = 0;
let stars = 3;
let clicks = 0;
let resetButton = document.querySelector('.fa-repeat');
let interval;
let time = 0;
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let matches = 8;
let deckContainer = document.querySelector('.container');
let winContainer = document.querySelector('.win');
let restartButton = winContainer.querySelector('button');

container.addEventListener('click', cardClicked);

resetButton.addEventListener('click', reset);

restartButton.addEventListener('click', function() {
  deckContainer.classList.remove('hidden');
  winContainer.classList.add('hidden');
  reset();
});


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


// Replace old elements with new shuffled elements
function replaceDeck() {
  let deck = document.querySelector('.deck');
  const newDeck = document.createElement('ul');
  newDeck.className = 'deck';
  const array = shuffle([...cards]);

  for (let i = 0; i < array.length; i++) {
    array[i].className = 'card';
    newDeck.appendChild(array[i]);
  }

  container.removeChild(deck);
  container.appendChild(newDeck);
}


function cardClicked(eve) {
  if (eve.target.nodeName === 'LI') {
    if (!clicks) {
      clicks = 1;
      timer();
      interval = window.setInterval(timer, 1000);
    }
    if (openCards.length === 0) {
      openCards.push(eve.target);
      openCards[0].classList.add('open');
      moves += 1;
      insertMoves();
    } else if (openCards.length === 1 && !eve.target.classList.contains('open') && !eve.target.classList.contains('match')) {
      openCards.push(eve.target);
      moves += 1;
      insertMoves();
      if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
        openCards[0].classList.remove('open');
        openCards[0].classList.add('match');
        openCards[1].classList.add('match');
        openCards = [];
        matches -= 1;
        if (!matches) {
          win();
        }
      } else {
        openCards[1].classList.add('open');
        // openCards[0].classList.remove('open');
        // openCards[0].classList.add('unmatch');
        // eve.target.classList.add('unmatch');
        openCards[0].classList.add('shake');
        openCards[1].classList.add('shake');
        oldCard = openCards[0];
        newCard = openCards[1];
        newCard.addEventListener('animationend', function() {
          // console.log(openCard);
          oldCard.classList.remove('open', 'shake');
          newCard.classList.remove('open', 'shake');
          openCards = [];
        });

      }
    } else {
      if (!eve.target.classList.contains('open') && !eve.target.classList.contains('match')) {
        oldCard.classList.remove('open', 'shake');
        newCard.classList.remove('open', 'shake');
        openCards = [];
        openCards.push(eve.target);
        openCards[0].classList.add('open');
        moves += 1;
        insertMoves();
      }
    }
  }
  console.log(moves);
}


function insertMoves() {
  document.querySelector('.moves').textContent = moves;
  switch (moves) {
    case 23:
      starring(2);
      break;
    case 29:
      starring(1);
      break;
    case 35:
      starring(0);
      break;
  }
}


function starring(visualStars) {
  stars -= 1;
  const starsArr = [...document.querySelector('.stars').getElementsByTagName('li')];
  starsArr[visualStars].firstElementChild.classList.replace('fa-star', 'fa-star-o');
  console.log(stars);
}


function timer() {
  time += 1;
  if (time < 3600) {
    minutes.textContent = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    seconds.textContent = time % 60 > 9 ? time % 60 : '0' + time % 60;
  } else {
    reset();
  }
}


function reset() {
  moves = 0;
  insertMoves();
  stars = 3;
  document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li><li><i class="fa fa-star"></i></li>';
  openCards = [];
  clicks = 0;
  clearInterval(interval);
  time = 0;
  matches = 8;
  minutes.textContent = '00';
  seconds.textContent = '00';
  replaceDeck();
}


function win() {
  clearInterval(interval);

  let movesSpan = winContainer.querySelector('.moves');
  let starsSpan = winContainer.querySelector('.stars');
  let scorePanelTime = document.querySelector('time');
  let timeSpan = winContainer.querySelector('.time');
  let tempMinIndicator;

  movesSpan.textContent = moves + ' moves';
  starsSpan.textContent = stars + (stars === 1 ? ' star' : ' stars');
  timeSpan.innerHTML = 'in ';
  timeSpan.appendChild(scorePanelTime.cloneNode(true));
  tempMinutesIndicator = document.createElement('span');
  tempMinutesIndicator.textContent = ' minutes';
  timeSpan.appendChild(tempMinutesIndicator);

  deckContainer.classList.add('hidden');
  winContainer.classList.remove('hidden');
}
