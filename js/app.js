/*
 * Create all variables and function calls
 */
const container = document.querySelector('.container');
const cards = document.getElementsByClassName('card');

// replace cards with new shuffled cards
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


/*
 * Create all events listners
 */
// listen for cards clicks
container.addEventListener('click', cardClicked);

// listen to reset button click
resetButton.addEventListener('click', reset);

// listen to congratulations panel resert button click
restartButton.addEventListener('click', function() {
  deckContainer.classList.remove('hidden');
  winContainer.classList.add('hidden');
  reset();
});
// listen for window resize to replace deck
// and cards with others which have appropiate sizes- for resposiveness
window.addEventListener('resize', function() {
  reset();
});


/*
 * Create all functions
 */
// function to shuffle cards -from http://stackoverflow.com/a/2450976-
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


// function to replace old cards with new shuffled cards
function replaceDeck() {
  let deck = document.querySelector('.deck');
  const newDeck = document.createElement('ul');
  newDeck.className = 'deck';
  const array = shuffle([...cards]);

  for (let i = 0; i < array.length; i++) {
    array[i].className = 'card';
    // make cards height equal to the width - for resposiveness
    array[i].style.height = window.getComputedStyle(array[i]).width;
    newDeck.appendChild(array[i]);
  }

  container.removeChild(deck);
  container.appendChild(newDeck);
  // if window screen < 550,
  // make deck height 1.0316 times its width - - for resposiveness
  if (window.innerWidth < 550) {
    let newDeckWidth = window.getComputedStyle(newDeck).width;
    newDeckWidth = newDeckWidth.split('');
    newDeckWidth.pop();
    newDeckWidth.pop();
    newDeckWidth = Number(newDeckWidth.join(''));

    newDeck.style.height = newDeckWidth * 1.0316 + 'px';
  }
}


// function to handle cards clicks - game logic
function cardClicked(eve) {
  // make sure that the click is on a card not on padding - event delegation
  if (eve.target.nodeName === 'LI') {
    // make sure that this is the first click in the game to start the timer
    if (!clicks) {
      clicks = 1;
      timer();
      interval = window.setInterval(timer, 1000);
    }
    // first possibility - there was no card open before the click
    if (openCards.length === 0) {
      openCards.push(eve.target);
      openCards[0].classList.add('open');
      moves += 1;
      insertMoves();
    }
    // second possibility - there was one open card before the click
    // + I'm not clicking on the previously open card or a matched card
    else if (openCards.length === 1 && !eve.target.classList.contains('open') && !eve.target.classList.contains('match')) {
      openCards.push(eve.target);
      moves += 1;
      insertMoves();
      // the two cards are of the same shape
      if (openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]) {
        openCards[0].classList.remove('open');
        openCards[0].classList.add('match');
        openCards[1].classList.add('match');
        openCards = [];
        matches -= 1;
        // wining condition - no more unmatched cards
        if (!matches) {
          win();
        }
      }
      // the two cards are different
      else {
        openCards[1].classList.add('open');
        openCards[0].classList.add('shake');
        openCards[1].classList.add('shake');
        oldCard = openCards[0];
        newCard = openCards[1];
        // animatation rejecting the match
        newCard.addEventListener('animationend', function() {
          oldCard.classList.remove('open', 'shake');
          newCard.classList.remove('open', 'shake');
          openCards = [];
        });
      }
    }
    // third possibility - there was two open cards before the click and they are not matched card
    // - in there animation phase and was supposed to be closed
    else {
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
}


// function to update moves counter in score panel
function insertMoves() {
  document.querySelector('.moves').textContent = moves;
  switch (moves) {
    case 25:
      starring(2);
      break;
    case 35:
      starring(1);
      break;
  }
}


// function to update visual stars in score panel
function starring(visualStars) {
  stars -= 1;
  const starsArr = [...document.querySelector('.stars').getElementsByTagName('li')];
  starsArr[visualStars].firstElementChild.classList.replace('fa-star', 'fa-star-o');
}


// function to update timer in score panel
function timer() {
  time += 1;
  if (time < 3600) {
    minutes.textContent = Math.floor(time / 60) > 9 ? Math.floor(time / 60) : '0' + Math.floor(time / 60);
    seconds.textContent = time % 60 > 9 ? time % 60 : '0' + time % 60;
  } else {
    reset();
  }
}


// function to reset the game
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


// function to show win page
function win() {
  clearInterval(interval);

  let movesSpan = winContainer.querySelector('.moves');
  let starsSpan = winContainer.querySelector('.stars');
  let scorePanelTime = document.querySelector('.score-panel-time');
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

/*
--------------------------------------------------------------------------
-----built by MW "Mustafa Wahba"------------------------------------------
--------------------------------------------------------------------------


                                 ###   ###
                                ####   ###         ###
                               #####   ###           ###
                              ######   ###             ###
                             #######   ###              ###
                ##          ###  ###   ###                ###
               ######      ###   ###   ###                 ###
              ###  #####  ###    ###   ###                  ###
             ###      ######     ###   ###                   ###
            ###         ###      ###   ###                   ###
           ###           #       ###   ###                   ###
           ###                   ###   ###                   ###
           ###                   ###   ###                   ###
           ###                   ###   ###       #           ###
           ###                   ###   ###      ###         ###
           ###                   ###   ###     ######      ###
            ###                  ###   ###    ###  #####  ###
             ###                 ###   ###   ###      ######
              ###                ###   ###  ###          ##
                ###              ###   #######
                 ###             ###   ######
                   ###           ###   #####
                     ###         ###   ####
                                 ###   ###


--------------------------------------------------------------------------
-----https://i-mw.github.io-----------------------------------------------
--------------------------------------------------------------------------
*/
