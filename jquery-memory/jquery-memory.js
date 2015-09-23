"use strict";

Array.prototype.shuffle = function(){ 
  let i = this.length, j, temp;
  while(--i > 0) {
    j = Math.floor(Math.random() * (i + 1));
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
    this.onWin = params.onWin || function(memory, currentTime){};
    this.onIncreaseTime = params.onIncreaseTime || function(memory, currentTime){};

    this.newGame();
  }
  
  newGame() {
    this.openCardCount = 0;
    this.currentlyOpenCards = [];
    this.motives = new Array(this.cardCount);
    this.createMotivesArray();
    
    this.gameTime = 0;
    var self = this;
    clearInterval(this.timer);
    this.timer = setInterval(function() {
      self.gameTime++;
      self.onIncreaseTime(self, self.gameTime);
    }, 1000);
  }

  createMotivesArray() {
    for(let i = 0, j = 65; i < this.motives.length; i += 2, j++) {
      this.motives[i] = String.fromCharCode(j);
      this.motives[i+1] = String.fromCharCode(j);
    }
    this.motives.shuffle();
  }
  createGameField() {
    this.clearGameField();
    var self = this;
    this.motives.forEach(function(elem, i, array) {
      let $tile = $("<div class='memory-tile'></div>");
      $tile.attr("id", "tile-"+ i );
      $tile.click(function(evt) {
        self.flipTile(evt.target, i);
      });
      self.$parent.append($tile);
    });
  }
  clearGameField() {
    if(this.$parent.children.length === 0) {
      return;
    }
    this.$parent.children().remove();
  }

  flipTile(sender, index) {
    if(sender.innerHTML == "" && this.currentlyOpenCards.length < 2) {
      this.showCard(sender, this.motives[index])
      this.currentlyOpenCards.push(sender);
    }
    if(this.currentlyOpenCards.length == 2) {
      if(this.currentlyOpenCards[0].innerHTML == this.currentlyOpenCards[1].innerHTML) {
        // correct
        this.currentlyOpenCards = [];
        this.openCardCount += 2;
        if(this.openCardCount >= this.cardCount) {
          clearInterval(this.timer);
          this.onWin(this, this.gameTime);
        }
      }
      else {
        // wrong
        var self = this;
        setTimeout(function() {
          self.hideCard(self.currentlyOpenCards[0]);
          self.hideCard(self.currentlyOpenCards[1]);
          self.currentlyOpenCards = [];
        }, 700);
      }
    }
  }
  showCard($card, motive) {
    $card.style.background = "white";
    $card.innerHTML = motive;   
  }
  hideCard($card) {
    $card.style.background = "url(memory-backside.jpg)";
    $card.innerHTML = "";
  }
}
