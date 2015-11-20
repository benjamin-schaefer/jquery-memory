"use strict"; // needs still "experimental javascript" enabled in browser!

/* jquery-memory
 * needs jquery, jquery-memoryCard.js and ecmascript 6!
 */

 var timer;

 Array.prototype.shuffle = function(){ 
  let i = this.length, j, temp;
  while(--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
    // [this[i], this[j]] = [this[j], this[i]];
    temp = this[j];
    this[j] = this[i];
    this[i] = temp;
  }
}

class Memory {
  constructor(cardCount, $parent, params) {
    this.$parent = $parent || null;
    this.cardCount = cardCount || 52;
    params = params || {};

    this.onWin = params.onWin || function(memory, currentTime) {};
    this.onIncreaseTime = params.onIncreaseTime || function(memory, currentTime) {};
    this.onShowCard = params.onShowCard || function(memory, $card) {};
    this.onHideCard = params.onHideCard || function(memory, $card) {};
    
    this.newGame();
  }
  
  newGame() {
    this.wonCardCount = 0;
    this.currentlyOpenCards = [];
    this.motives = new Array(this.cardCount);
    this.clickCount = 0;
    this.gameTime = 0;
    this.cards = new Array(this.cardCount);

    this.createMotivesArray();
    this.resetGameField();
    this.resetGameTimer();
  }

  createMotivesArray() {
    for(let i = 0, j = 65; i < this.motives.length; i += 2, j++) {
      this.motives[i] = String.fromCharCode(j);
      this.motives[i+1] = String.fromCharCode(j);
    }
    this.motives.shuffle();
  }
  
  resetGameField() {
    this.removeGameField();
    this.createGameField();
  }

  removeGameField() {
    this.$parent.children().remove(); 
  }

  createGameField() {        
    this.motives.forEach((elem, i, array) => {
      let $card = $("<div class='memory-card'></div>");
      $card.attr("id", "card-"+ i );
      this.cards[i] = new MemoryCard($card, elem, this);
      $card.click(evt => this.onCardClick(this.cards[i], i) );
      $card.click(evt => this.cards[i].onClick(this.cards[i], i) );
      this.$parent.append($card);
    });
  }

  resetGameTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      this.gameTime++;
      this.onIncreaseTime(this, this.gameTime);
    }, 1000);
  }

  onCardClick(card, index) {
    this.tryFlipCard(card, index);
  }

  tryFlipCard(card, index) {
    if(this.isFlippable(card)) {
      this.clickCount++; 
      card.isFlipped = true;
      this.currentlyOpenCards.push(card);
      
      card.show();
    }
  }

  get isAnimating() {
    this.cards.forEach((card) => {
      if (card.isAnimating) {
        return true;
      }
    });
    return false;
  }

  isFlippable(card) {
    return !card.isFlipped
      && !this.isAnimating
      && this.currentlyOpenCards.length < 2;
  }

  handleFlippedCards() {
    if(this.areTwocardsFlipped()) {
      if(this.areFlippedCardsIdentical()) {
        this.winPair();
      }
      else {
        this.hideFlippedCards();
      }
    }
  }

  areTwocardsFlipped() {
    return this.currentlyOpenCards.length === 2;
  }

  areFlippedCardsIdentical() {
    return this.currentlyOpenCards[0].motive == this.currentlyOpenCards[1].motive
  }

  winPair() {
    this.currentlyOpenCards[0].markAsWon();
    this.currentlyOpenCards[1].markAsWon();
    this.currentlyOpenCards = [];
    this.wonCardCount += 2;

    if(this.isWon()) {
      this.winGame();
    }
  }

  isWon() {
    return this.wonCardCount >= this.cardCount;
  }

  winGame() {
    clearInterval(timer);
    this.onWin(this, this.gameTime, this.clickCount);
  }

  hideFlippedCards(){
    setTimeout(() => {
      this.currentlyOpenCards[0].hide();
      this.currentlyOpenCards[1].hide();
      // TODO: too early; execute once both cards are hidden again
      // this.currentlyOpenCards = [];
    }, 1500);
  }

  showCard(card, motive) {    
    var switchCard = () => {
      card.style.background = "white";
      $card.innerHTML = motive;  
    }
    this.animateCard(180, $card, switchCard);
    this.onShowCard(this, $card);
  }

  hideCard($card) {
    var switchCard = () => {
      $card.style.background = "url(assets/memory-backside.jpg)";
      $card.innerHTML = "";
    }
    this.animateCard(0, $card, switchCard);
    this.onHideCard(this, $card);
  }

  animateCard(aimRotateY, $card, onSwitch) {
    var duration = 1000;
    var switched = false;

    $($card).animate({ rotateY: aimRotateY }, 
    {
      duration: duration,
      start: () => {
      },
      progress: (animation, progress) => {
        if(progress > 0.5 && !switched) {
          switched = true;
          onSwitch();
        }
      },
      step: (now, tween) => {         
        let angle = (now < 90)? now: now - 180;
        $($card).css("transform", "rotateY(" + angle + "deg)");
      },
      complete: () => { 
        this.handleFlippedCards($card);
      }
    })
  }
}

(($) => {
  $.fn.memory = function(cardCount, params) {
    // re-definition deletes maybe existing version of memory
    // guarantee that EVERY selector element gets a memory game
    return this.each(() => { new Memory(cardCount, $(this), params); })
  }
})(jQuery);

// TODO: 
// array mit Bildern übergeben
// alternativ: Länge des Arrays mit Buchstaben übergeben
// Handler für Flipping der Karten -> Verhalten selbst definieren!