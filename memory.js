"use strict";

function startGame(cardCount) {
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
  $memoryBoard.memory(
    cardCount, 
    {
      onWin: function(memory, gameTime, clickCount) {
        $winScreen.dialog({
          modal: true,
          draggable: false,
          title: "Gewonnen!",
          Buttons: [
          {
            text: "Neues Spiel",
            click: function(){
              newGameDialog();
              $(this).dialog("close");
            }
          },
          {
            text: "Schließen",
            click: function(){
              $(this).dialog("close");
            }
          },
          ]
        });
        $winScore.html("Sie haben " + timeString + " und " + clickCount + " Klicks benötigt.");
      },
      onIncreaseTime: function(memory, currentTime) {
        timeString = Number.parseInt(currentTime / 60) + " min " + 
          currentTime % 60 + " sek";
        $(".game-time").html("Zeit: " + timeString);
      },
      onShowCard: function(memory, $card) {
      },
      onHideCard: function (memory, $card) {
      }
    });
}

function newGameDialog(){
  // $newGame.dialog({
  //   modal: true,
  //   draggable: false,     
  //   title: "Neues Spiel",
  //   buttons: [
  //     {
  //       text: "Spiel starten",
  //       click: function(){
  //         var txtMotiveCount = Number.parseInt($("#txtMotiveCount")[0].value);
  //         if(typeof txtMotiveCount == "number" && txtMotiveCount > 0) {
  //           var cardCount = txtMotiveCount * 2;
  //         }
  //         startGame(cardCount);
  //         $(this).dialog("close");
  //       }
  //     },
  //     {
  //       text: "abbrechen",
  //       click: function(){
  //         $(this).dialog("close");
  //       }
  //     }
  //   ]
  // });  
  startGame(6);
}

var $newGame, $memoryBoard, $gameField, $winScreen, $winScore;
$(function(){
  $("#lnkNewGame").click(newGameDialog);
  $newGame = $(".new-game");
  $gameField = $(".game-field");
  $memoryBoard = $(".memory-board");
  $winScreen = $(".win-screen");
  $winScore = $(".win-score");
});

// TODO: Animation für Auf- und Zudecken
// TODO: Schreiben in Dateien anschauen

// TODO: Highscore - Clicks pro Karte berechnen
// TODO: Highscore - Zeit pro Karte berechnen Clicks pro Karte berechnen
// TODO: Highscore - Zeit pro Karte berechnen
// pro Kartenpaar-Anzahl eigener Score
// Hauptkriterium: Zeit, Nebenkriterium 1: Clicks pro Karte
// -> Score mit bestem Verhältnis 
// je Kartenzahl separater Score?
