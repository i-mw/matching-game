/*
 * Create a list that holds all of your cards
 */
const container = document.querySelector('.container');
let deck = document.querySelector('.deck');
let cards = deck.getElementsByClassName('card');

function sleep(milliseconds){
  const t0 = performance.now();
  while(performance.now() < t0 + milliseconds){

  }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
function replace(){
  const newDeck = document.createElement('ul');
  newDeck.className = 'deck';
  const array = shuffle([...cards]);

  for(let i=0; i<array.length; i++){
    newDeck.appendChild(array[i]);
  }

  container.removeChild(deck);
  container.appendChild(newDeck);
}

replace();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck = document.querySelector('.deck');
let openCards = [];
let oldCard, newCard;
let moves = 0;
let stars = 3;
deck.addEventListener('click', cardClicked);

function cardClicked(eve){
  if(eve.target.nodeName === 'LI'){

      if(openCards.length === 0){
        openCards.push(eve.target);
        openCards[0].classList.add('open');
        moves += 1;
        insertMoves();
      }
      else if(openCards.length === 1 && !eve.target.classList.contains('open') && !eve.target.classList.contains('match')){
        openCards.push(eve.target);
        moves += 1;
        insertMoves();
        if(openCards[0].firstElementChild.classList[1] === openCards[1].firstElementChild.classList[1]){
          openCards[0].classList.remove('open');
          openCards[0].classList.add('match');
          openCards[1].classList.add('match');
          openCards = [];
        }
        else{
          openCards[1].classList.add('open');
          // openCards[0].classList.remove('open');
          // openCards[0].classList.add('unmatch');
          // eve.target.classList.add('unmatch');
          openCards[0].classList.add('shake');
          openCards[1].classList.add('shake');
          oldCard = openCards[0];
          newCard = openCards[1];
          newCard.addEventListener('animationend', function(){
            // console.log(openCard);
            oldCard.classList.remove('open', 'shake');
            newCard.classList.remove('open', 'shake');
            openCards = [];
          });

        }
      }
      else {
        if(!eve.target.classList.contains('open') && !eve.target.classList.contains('match')){
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

function insertMoves(){
  document.querySelector('.moves').textContent = moves;
  switch (moves){
    case 23 : starring(2); break;
    case 29 : starring(1); break;
    case 35 : starring(0); break;
  }
}

function starring(visualStars){
  stars -= 1;
  const starsArr = [...document.querySelector('.stars').getElementsByTagName('li')];
  starsArr[visualStars].firstElementChild.classList.replace('fa-star', 'fa-star-o');
  console.log(stars);
}
