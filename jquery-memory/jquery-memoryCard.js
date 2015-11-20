"use strict"; 

/* jquery-memoryCard.js
 *
 */

class MemoryCard {
  constructor($elem, motive, memory) {
    this.$elem = $elem;
    this.motive = motive || "";
    this.memory = memory || null;
    
    this.init();
  }

  init() {
    this.isFlipped = false;
    this.isAnimating = false;
    this.isWon = false;

  }

  markAsWon() {
    this.$elem.css("border", "#000 2px solid");
  }
  
  setMotive(motive){
    this.motive = motive;
  }

  onClick(card, index) {
  }

  show(onComplete) {
    var switchCard = () => {
      this.$elem.css("background", "white");
      this.$elem.html(this.motive);
    }
    this.animate(180, switchCard, onComplete);
    this.isFlipped = true;
  }

  hide(onComplete) {
    var switchCard = () => {
      this.$elem.css("background", "url(assets/memory-backside.jpg)");
      this.$elem.html("");
      // delete first array element from open cards
      this.memory.currentlyOpenCards.shift();
    }
    this.animate(0, switchCard, onComplete);
    this.isFlipped = false;
  }

  animate(aimRotateY, onSwitch, onComplete) {
    var duration = 1000;
    var switched = false;

    this.$elem.animate({ rotateY: aimRotateY }, 
    {
      duration: duration,
      start: () => {
      this.isAnimating = true;
      },
      progress: (animation, progress) => {
        if(progress > 0.5 && !switched) {
          switched = true;
          onSwitch();
        }
      },
      step: (now, tween) => {         
        let angle = (now < 90)? now: now - 180;
        this.$elem.css("transform", "rotateY(" + angle + "deg)");
      },
      complete: () => { 
        this.isAnimating = false;
        // onComplete();
        this.memory.handleFlippedCards();
      }
    })
  }
}