"use strict";

function startGame(){
  var txtMotiveCount = Number.parseInt($("#txtMotiveCount")[0].value);
  if(typeof txtMotiveCount == "number" && txtMotiveCount > 0) {
    var cardCount = txtMotiveCount * 2;
  }
  $newGame.hide();
  $gameField.show();
  $memoryBoard.flowtype({
    minFont: 32,
    maxFont: 64,
    minimum: 300,
    maximum: 992,
    fontRatio: 12
  });

  var timeString = "";
  var memory = new Memory(
    cardCount, 
    $memoryBoard, 
    {
      onWin: function(memory, gameTime) {
        console.log("Gewonnen!");
        console.log("Sie haben " + timeString + " Sekunden benötigt.");
      },
      onIncreaseTime: function(memory, currentTime) {
        timeString = Number.parseInt(currentTime / 60) + " min " + 
          currentTime % 60 + " sek";
        $(".game-time").html("Zeit: " + timeString);
      }
    });
  memory.createGameField();
}

function newGameDialog(){
  $newGame.dialog({
    modal: true,
    draggable: false,     
    title: "Neues Spiel",
    buttons: [
      {
        text: "Spiel starten",
        click: function(){
          startGame();
          $(this).dialog("close");
        }
      },
      {
        text: "abbrechen",
        click: function(){
          $(this).dialog("close");
        }
      }
    ]
  });  
}

var $newGame, $memoryBoard, $gameField;
$(function(){
  $("#lnkNewGame").click(newGameDialog);
  $newGame = $(".new-game");
  $gameField = $(".game-field");
  $memoryBoard = $(".memory-board");
});

// TODO: Animation für Auf- und Zudecken
// TODO: Score definieren
// TODO: Schreiben in Dateien anschauen