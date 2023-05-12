<template>
  <div :class="pieceClass()" class="piece" @click="select(this.squareContent.row, this.squareContent.col)"></div>
</template>
<script>
  import { useBordStore } from "../../../stores/bord";
  import io from "socket.io-client";
  const socket = io("http://localhost:4000");
  export default {
    name: "CheckerPiece",
    props: ["squareContent"],
    setup() {
      const bord = useBordStore();
      return { bord };
    },
    data() {
      return {
        posibleRight: "",
        posibleLeft: "",
        posibleRightHit: "",
        posibleLeftHit: "",

        posibleBackRightHit: "",
        posibleBackLeftHit: "",
        posibleBackRight: "",
        posibleBackLeft: "",

        old: "",

        eenmaligeCount: 0,
      };
    },
    created() {
      socket.on("play", (index) => {
        // console.log("kiekeboe index", index);
        this.bord.checkerPieces = index;
      });
    },
    methods: {
      sendBoardToServer() {
        socket.emit("play", this.bord.checkerPieces);
      },

      pieceClass() {
        /**
         * Kijkt welke letter het vakje heeft. en bepaalt aan de hand daarvan welke kleur classen die moet krijgen
        */
        if (this.squareContent.letter == "w") {
          return "white-piece";
        } else if (this.squareContent.letter == "b") {
          return "black-piece";
        } else if (this.squareContent.letter == "x") {
          return "";
        } else if (this.squareContent.letter == "rood") {
              // return "roodRocket";
              return "rood";
        } else if (this.squareContent.letter == "db") {
          return "black-piece-dam";
        } else if (this.squareContent.letter == "dw") {
          return "white-piece-dam";
        }
      },
      select(indexRow, indexCol) {
      /**
       * Kijkt eerst of @param this.bord.redIsOnTheBoard is true.
       * mocht dit zo zijn dan ga je meteen door naar de @function colorCheckerPiece() functie
       * is dit niet het geval dan mag je een steen aanklikken en dan krijgt die de groene css op die steen.
      */
        if (this.bord.checkerPieces[indexRow][indexCol] == "db" || this.bord.checkerPieces[indexRow][indexCol] == "dw") {
          if (this.bord.redIsOnTheBoard) {
            this.colorCheckerPiece(indexRow, indexCol);
            this.sendBoardToServer();
          } else {
            console.log("weet niet meer wat plan was send help") //hier moet iets

            var oldActive = document.getElementsByClassName("groenRocket"); // kijkt naar de olde die de class groen heeft gekregen
            for (var i = 0; i < oldActive.length; i++) {
              oldActive[i].classList.remove("groenRocket");
            }
            if (this.squareContent.letter != " ") {
              event.target.classList.add("groenRocket");
            }
            this.colorCheckerPiece(indexRow, indexCol);
            this.sendBoardToServer();
          }

        } else {

          if (this.bord.redIsOnTheBoard) {
            this.colorCheckerPiece(indexRow, indexCol);
            this.sendBoardToServer();
          } else {
            // if (this.bord.eenmaligeCount == 0) { //eerste ronde
            //   var oldActive = document.getElementsByClassName("groen"); // kijkt naar de olde die de class groen heeft gekregen
            //   for (var i = 0; i < oldActive.length; i++) {
            //     oldActive[i].classList.remove("groen");
            //   }
            //     if (this.squareContent.letter != " ") {
            //       event.target.classList.add("groen");
            //     }
            //     this.colorCheckerPiece(indexRow, indexCol);
            //     this.sendBoardToServer();
            //     this.bord.eenmaligeCount = this.bord.eenmaligeCount + 1;
            //   }
              // if (this.bord.eenmaligeCount >= 1) {
                console.log("kiekeboe")
                if (this.bord.whiteTurn && this.bord.checkerPieces[indexRow][indexCol] == "w") {
                  var oldActive = document.getElementsByClassName("groen"); // kijkt naar de olde die de class groen heeft gekregen
                  for (var i = 0; i < oldActive.length; i++) {
                    oldActive[i].classList.remove("groen");
                  }
                  if (this.squareContent.letter != " ") {
                    event.target.classList.add("groen");
                  }
                  this.colorCheckerPiece(indexRow, indexCol);
                  this.sendBoardToServer();
                }
                if (!this.bord.whiteTurn && this.bord.checkerPieces[indexRow][indexCol] == "b") {
                  var oldActive = document.getElementsByClassName("groen"); // kijkt naar de olde die de class groen heeft gekregen
                  for (var i = 0; i < oldActive.length; i++) {
                    oldActive[i].classList.remove("groen");
                  }
                  if (this.squareContent.letter != " ") {
                    event.target.classList.add("groen");
                  }
                  this.colorCheckerPiece(indexRow, indexCol);
                  this.sendBoardToServer();
                }
              }
          // }
        }
      },
      colorCheckerPiece(indexRow, indexCol) {
        /**
         * Kijkt eerst of @param this.bord.redIsOnTheBoard is true.
         * mocht dit zo zijn dan ga je meteen door naar de @function movePiece() functie
         * is dit niet het geval dan wordt er gekeken welke steen je daadwerkelijk aanklikt
        */
        let oldValueLetter = this.bord.selectedPiece;
        if (this.bord.redIsOnTheBoard) {
          if (this.bord.checkerPieces[indexRow][indexCol] == "rood") {
            this.bord.selectedPiece = "" + indexRow + indexCol;
            this.movePiece(indexRow, indexCol, oldValueLetter);
          }
        } else {
          this.bord.selectedPiece = "" + indexRow + indexCol;
          if (this.bord.checkerPieces[indexRow][indexCol] == "b") {
            this.posibleMoves(indexRow, indexCol, "b");
          } else if (this.bord.checkerPieces[indexRow][indexCol] == "w") {
            this.posibleMoves(indexRow, indexCol, "w");
          } else if (this.bord.checkerPieces[indexRow][indexCol] == "db") {
            this.posibleMovesKing(indexRow, indexCol, "db");
          } else if (this.bord.checkerPieces[indexRow][indexCol] == "dw") {
            this.posibleMovesKing(indexRow, indexCol, "dw");
          }
        }
        this.sendBoardToServer();
      },
      posibleMoves(indexRow, indexCol, color) {
        /**
         * Kijkt eerst of @var color de kleur b van black is of w van white (dat is de steen die je hebt aan geklikt).
         * nadat dat bepaalt is dan zet die de @let checkLetter op de tegenovergestelde letter van die je hebt aangeklikt.
         * daarna gaat die alle mogelijkheden brekenen in @var this.posibleRight, @var this.posibleLeft, @var posibleRightHit, @var posibleLeftHit
         * en daarna wordt wook zwart berkend @var posibleBackRight, @var posibleBackLeft, @var posibleBackRightHit, @var posibleBackLeftHit
         * en daarna wordt alles opgeslagen in de @let leftDigit1, leftDigit2 en zo voort.
         * hierna wordt er gekeken of het berekende getal (de @var this.posibleRight) onder de kleiner is dan 9 en dan wordt wat magic gebruikt (lange uitleg en if spreekt voor zichzelf)
         * dit wordt gedaan om te verkomen dat stenen niet verschijnen.
         * 
         * nadat dat gedaan is wordt gekeken welke moves mogelijk zijn voor normalen damstenen.
         * als er een slag mogelijk is dan zullen de 2 variable op true gezet worden;
         * this.bord.youMaySmack = true; //als dit op true is gezet kan je dus slaan als je lang de slaan functie komt.
         * this.bord.redIsOnTheBoard = true; //dit zorgt er voor dat de @function select() meteen door gaat naar de @function colorCheckerPiece() en omdat die rood is gaat die door naar de @function movePiece()
        */
        this.bord.selectedPiece = "" + indexRow + indexCol;
        this.bord.oldLetter = this.bord.checkerPieces[indexRow][indexCol];
        let checkLetter = "";
        let checkLetterKing = "";

        if (color == "b") {
          this.posibleRight = (this.bord.selectedPiece - 9).toString();
          this.posibleLeft = (this.bord.selectedPiece - 11).toString();
          this.posibleRightHit = (this.bord.selectedPiece - 18).toString();
          this.posibleLeftHit = (this.bord.selectedPiece - 22).toString();
          checkLetter = "w";
          checkLetterKing = "dw";
          this.posibleBackRight = Math.abs(-this.bord.selectedPiece - 9).toString();
          this.posibleBackLeft = Math.abs(-this.bord.selectedPiece - 11).toString();
          this.posibleBackRightHit = Math.abs(-this.bord.selectedPiece - 18).toString();
          this.posibleBackLeftHit = Math.abs(-this.bord.selectedPiece - 22).toString();
          this.sendBoardToServer();
        } else if (color == "w") {
          this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9).toString();
          this.posibleRight = Math.abs(-this.bord.selectedPiece - 11).toString();
          this.posibleLeftHit = Math.abs(-this.bord.selectedPiece - 18).toString();
          this.posibleRightHit = Math.abs(-this.bord.selectedPiece - 22).toString();
          checkLetter = "b";
          checkLetterKing = "db";
          this.posibleBackRight = (this.bord.selectedPiece - 9).toString();
          this.posibleBackLeft = (this.bord.selectedPiece - 11).toString();
          this.posibleBackRightHit = (this.bord.selectedPiece - 18).toString();
          this.posibleBackLeftHit = (this.bord.selectedPiece - 22).toString();
          this.sendBoardToServer();
        }

        let leftDigit1 = parseInt(this.posibleLeft.charAt(0)); //dit is voor zwart
        let leftDigit2 = parseInt(this.posibleLeft.charAt(1));
        let rightDigit1 = parseInt(this.posibleRight.charAt(0));
        let rightDigit2 = parseInt(this.posibleRight.charAt(1));

        let hitRight1 = parseInt(this.posibleRightHit.charAt(0));
        let hitRight2 = parseInt(this.posibleRightHit.charAt(1));
        let hitLeft1 = parseInt(this.posibleLeftHit.charAt(0));
        let hitLeft2 = parseInt(this.posibleLeftHit.charAt(1));


        let leftDigit1Back = parseInt(this.posibleBackLeft.charAt(0));
        let leftDigit2Back = parseInt(this.posibleBackLeft.charAt(1));
        let rightDigit1Back = parseInt(this.posibleBackRight.charAt(0));
        let rightDigit2Back = parseInt(this.posibleBackRight.charAt(1));

        let hitRight1Back = parseInt(this.posibleBackRightHit.charAt(0));
        let hitRight2Back = parseInt(this.posibleBackRightHit.charAt(1));
        let hitLeft1Back = parseInt(this.posibleBackLeftHit.charAt(0));
        let hitLeft2Back = parseInt(this.posibleBackLeftHit.charAt(1));

        if (this.posibleRight < 9) {
          console.log("We zijn aan het einde van het bord Rechts")
          rightDigit2 = rightDigit1
          rightDigit1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleLeft < 9) {
          console.log("We zijn aan het einde van het bord Links")
          leftDigit2 = leftDigit1
          leftDigit1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleRightHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN Rechts")
          hitRight2 = hitRight1
          hitRight1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleLeftHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN LInks")
          hitLeft2 = hitLeft1
          hitLeft1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRight < 9) {
          console.log("We zijn aan het einde van het bord Rechts")
          rightDigit2Back = rightDigit1Back
          rightDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeft < 9) {
          console.log("We zijn aan het einde van het bord Links")
          leftDigit2Back = leftDigit1Back
          leftDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRightHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN Rechts")
          hitRight2Back = hitRight1Back
          hitRight1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeftHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN LInks")
          hitLeft2Back = hitLeft1Back
          hitLeft1Back = 0
          this.sendBoardToServer();
        }

        if (this.posibleBackRight > 99) {
          console.log("posibleBackRight valt buiten bord")
          rightDigit2Back = 0
          rightDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeft > 99) {
          console.log("valt buiten bord")
          leftDigit2Back = 0
          leftDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRightHit > 99) {
          console.log("valt buiten bord")
          hitRight2Back = 0
          hitRight1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeftHit > 99) {
          console.log("posibleBackLeftHit valt buiten bord")
          hitLeft2Back = 0
          hitLeft1Back = 0
          this.sendBoardToServer();
        }
        if (this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetter && this.bord.checkerPieces[hitRight1][hitRight2] == " " ||
          this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetter && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " ||
          this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetter && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " ||
          this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetter && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " " ||

          this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetterKing && this.bord.checkerPieces[hitRight1][hitRight2] == " " ||
          this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetterKing && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " ||
          this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " ||
          this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " "
        ) {
          if (this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetter && this.bord.checkerPieces[hitRight1][hitRight2] == " " || this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetterKing && this.bord.checkerPieces[hitRight1][hitRight2] == " ") {
            this.bord.checkerPieces[hitRight1][hitRight2] = "rood"
            this.bord.youMaySmack = true;
            this.bord.redIsOnTheBoard = true;
            this.sendBoardToServer();
          }

          if (this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetter && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " || this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetterKing && this.bord.checkerPieces[hitLeft1][hitLeft2] == " ") {
            this.bord.checkerPieces[hitLeft1][hitLeft2] = "rood"
            this.bord.youMaySmack = true;
            this.bord.redIsOnTheBoard = true;
            this.sendBoardToServer();
          }

          if (this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetter && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " || this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " ") {
            //acher slaan
            this.bord.checkerPieces[hitRight1Back][hitRight2Back] = "rood"
            this.bord.youMaySmack = true;
            this.bord.redIsOnTheBoard = true;
            this.sendBoardToServer();
          }

          if (this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetter && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " " || this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " ") {
            //acher slaan
            this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] = "rood"
            this.bord.youMaySmack = true;
            this.bord.redIsOnTheBoard = true;
            this.sendBoardToServer();
          }
        } else {
          if (this.bord.checkerPieces[leftDigit1][leftDigit2] == " ") {
            this.bord.checkerPieces[leftDigit1][leftDigit2] = "rood"; //links kan
            this.bord.redIsOnTheBoard = true;
            this.bord.keepGoing = false;
            this.sendBoardToServer();
          }
          if (this.bord.checkerPieces[rightDigit1][rightDigit2] == " ") {
            this.bord.checkerPieces[rightDigit1][rightDigit2] = "rood"; //rechts kan
            this.bord.redIsOnTheBoard = true;
            this.bord.keepGoing = false;

            this.sendBoardToServer();
          }
        }
      },

      posibleMovesKing(indexRow, indexCol, color) {
        this.bord.selectedPiece = "" + indexRow + indexCol;
        this.bord.oldLetter = this.bord.checkerPieces[indexRow][indexCol];
        let checkLetter1 = "";
        let checkLetter2 = "";

        if (color == "db") {
          checkLetter1 = "w"; //zo weet die over welke stenen die wel mag slaan
          checkLetter2 = "dw";
          this.sendBoardToServer();
        } else if (color == "dw") {
          checkLetter1 = "b";
          checkLetter2 = "db";
        }
        let ThereHasBeenAHit = false;
        //linksachter
        for (let i = 1; i < 10; i++) {
          if (Math.abs(-this.bord.selectedPiece - 9 * i) > 99 || Math.abs(-this.bord.selectedPiece - 9 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9 * i).toString();

            let left1 = parseInt(this.posibleLeft.charAt(0));
            let left2 = parseInt(this.posibleLeft.charAt(1));
            if (this.bord.checkerPieces[left1][left2] == " ") {
              this.bord.checkerPieces[left1][left2] = "rood";
              this.bord.redIsOnTheBoard = true;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(-this.bord.selectedPiece - 9 * i) > 99 || Math.abs(-this.bord.selectedPiece - 9 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9 * i).toString();
                  let left1 = parseInt(this.posibleLeft.charAt(0));
                  let left2 = parseInt(this.posibleLeft.charAt(1));
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //rechtsachter
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(-this.bord.selectedPiece - 11 * i) > 99 || Math.abs(-this.bord.selectedPiece - 11 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(-this.bord.selectedPiece - 11 * i).toString();
            let left1 = parseInt(this.posibleLeft.charAt(0));
            let left2 = parseInt(this.posibleLeft.charAt(1));
            if (this.bord.checkerPieces[left1][left2] == " ") {
              this.bord.checkerPieces[left1][left2] = "rood";
              this.bord.redIsOnTheBoard = true;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(-this.bord.selectedPiece - 11 * i) > 99 || Math.abs(-this.bord.selectedPiece - 11 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(-this.bord.selectedPiece - 11 * i).toString();
                  let left1 = parseInt(this.posibleLeft.charAt(0));
                  let left2 = parseInt(this.posibleLeft.charAt(1));
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    ThereHasBeenAHit = true;
                    this.bord.youMaySmackKing = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //linksvoor
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(this.bord.selectedPiece - 11 * i) > 99 || Math.abs(this.bord.selectedPiece - 11 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(this.bord.selectedPiece - 11 * i).toString();
            let left1;
            let left2;
            if (this.posibleLeft < 10) {
              left1 = 0;
              left2 = parseInt(this.posibleLeft.charAt(0));
            } else {
              left1 = parseInt(this.posibleLeft.charAt(0));
              left2 = parseInt(this.posibleLeft.charAt(1));
            }
            if (this.bord.checkerPieces[left1][left2] == " ") {
              this.bord.checkerPieces[left1][left2] = "rood";
              this.bord.redIsOnTheBoard = true;
              if (this.posibleLeft <= 11) {
                i = 10;
              }
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(this.bord.selectedPiece - 11 * i) > 99 || Math.abs(this.bord.selectedPiece - 11 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(this.bord.selectedPiece - 11 * i).toString();
                  if (this.posibleLeft < 9) {
                    left1 = 0;
                    left2 = parseInt(this.posibleLeft.charAt(0));
                    i = 10;
                  } else {
                    left1 = parseInt(this.posibleLeft.charAt(0));
                    left2 = parseInt(this.posibleLeft.charAt(1));
                  }
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //rechtsvoor
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(this.bord.selectedPiece - 9 * i) > 99 || Math.abs(this.bord.selectedPiece - 9 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(this.bord.selectedPiece - 9 * i).toString();
            let left1;
            let left2;
            if (this.posibleLeft < 10) {
              left1 = 0;
              left2 = parseInt(this.posibleLeft.charAt(0));
            } else {
              left1 = parseInt(this.posibleLeft.charAt(0));
              left2 = parseInt(this.posibleLeft.charAt(1));
            }
            if (this.bord.checkerPieces[left1][left2] == " ") {
              this.bord.checkerPieces[left1][left2] = "rood";
              this.bord.redIsOnTheBoard = true;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(this.bord.selectedPiece - 9 * i) > 99 || Math.abs(this.bord.selectedPiece - 9 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(this.bord.selectedPiece - 9 * i).toString();
                  if (this.posibleLeft < 10) {
                    left1 = 0;
                    left2 = parseInt(this.posibleLeft.charAt(0));
                  } else {
                    left1 = parseInt(this.posibleLeft.charAt(0));
                    left2 = parseInt(this.posibleLeft.charAt(1));
                  }
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
      },
      movePiece(indexRow, indexCol, oud) {
        /**
         * Gaat als eerst alle informatie door zetten naar de @function smackThePiece() om te kijken of je kan slaan
         * daarna heb je wel of niet geslagen en kom je als waren terug bij deze fucntie. 
         * nu ga je als eerst de @var youMaySmack meteen op valse zetten want als je kon slaan dan is het gebeurt.
         * en nu ga je in deze fucntie kijken of checkerPieces rood is. als dat zo is dan wordt er door het hele bordt geloopt.
         * al loopend door het bord verwijderen we allen "rood" in de checkerPieces array en zetten we het op " " leeg.
         * 
         * daarna zetten we nog @var oud wat de oude damsteen positie is leeg.
         * dan als laast onderaan deze functie wordt je door gestuurd naar de @function changePieceToDam en dit kijkt dan vervolgens of zwart boven aan het bord is of wit onderaan het bord.
        */
        this.smackKing(oud, this.bord.selectedPiece);
        this.smackThePiece(oud, this.bord.selectedPiece);
        this.bord.youMaySmack = false;
        this.bord.youMaySmackKing = false;
        if (this.bord.checkerPieces[indexRow][indexCol] == "rood") {
          for (let i = 0; i < this.bord.checkerPieces.length; i++) {
            for (let j = 0; j < this.bord.checkerPieces[i].length; j++) {
              if (this.bord.checkerPieces[i][j] == "rood") {
                // console.log(i +" "+ j)
                this.bord.checkerPieces[i][j] = " ";
              }
            }
          }
          oud = oud.toString();
          let oud1 = parseInt(oud.charAt(0));
          let oud2 = parseInt(oud.charAt(1));
          this.bord.checkerPieces[oud1][oud2] = " ";
        }
        this.bord.checkerPieces[indexRow][indexCol] = this.bord.oldLetter;
        this.bord.redIsOnTheBoard = false;
        this.changePieceToDam(indexRow, indexCol);
        this.reapeatPosibileHitMoves(indexRow, indexCol, this.bord.checkerPieces[indexRow][indexCol]);
        if (this.bord.checkerPieces[indexRow][indexCol] == "b" && !this.bord.keepGoing || this.bord.checkerPieces[indexRow][indexCol] == "db" && !this.bord.keepGoing){
          this.changeWhiteTurn();
          console.log("WHITE IS")
        }
        if (this.bord.checkerPieces[indexRow][indexCol] == "w" && !this.bord.keepGoing || this.bord.checkerPieces[indexRow][indexCol] == "dw" && !this.bord.keepGoing ){
          this.changeBlackTurn();
          console.log("ZWART IS")

        }
        this.sendBoardToServer();
      },
      smackKing(oldPosition, newPosition) {
        if (this.bord.youMaySmackKing) {
          // console.log("bitch get out the way, i may smack")
          //wat moet er gebeuren
          let berekend = oldPosition - newPosition
          //rechtsboven of links onder
          if (berekend % 9 == 0) {
            //rechtsboven
            if (oldPosition > newPosition) {
              for (let i = 1; i < 10; i++) {
                let hetGetal = oldPosition - (9 * i);
                if (hetGetal == newPosition) {
                  i = 10
                } else {
                  hetGetal = hetGetal.toString();
                  let hetGetal1;
                  let hetGetal2;
                  if (hetGetal < 10) {
                    hetGetal1 = 0;
                    hetGetal2 = parseInt(hetGetal.charAt(0));
                  } else {
                    hetGetal1 = parseInt(hetGetal.charAt(0));
                    hetGetal2 = parseInt(hetGetal.charAt(1));
                  }
                  this.bord.checkerPieces[hetGetal1][hetGetal2] = " "
                }
              }
              this.winnerCounter(this.bord.oldLetter);
            } else if (oldPosition < newPosition) { ///links onder
              for (let i = 1; i < 10; i++) {
                let reken = 9 * i;
                let hetGetal = +oldPosition + +reken;
                if (hetGetal == newPosition) {
                  i = 10
                } else {
                  hetGetal = hetGetal.toString();
                  let hetGetal1;
                  let hetGetal2;
                  if (hetGetal < 10) {
                    hetGetal1 = 0;
                    hetGetal2 = parseInt(hetGetal.charAt(0));
                  } else {
                    hetGetal1 = parseInt(hetGetal.charAt(0));
                    hetGetal2 = parseInt(hetGetal.charAt(1));
                  }
                  this.bord.checkerPieces[hetGetal1][hetGetal2] = " "
                }
              }
              this.winnerCounter(this.bord.oldLetter);
            }
          }
          if (berekend % 11 == 0) {
            if (oldPosition > newPosition) {
              //rechts boven
              for (let i = 1; i < 10; i++) {
                let hetGetal = oldPosition - (11 * i);
                if (hetGetal == newPosition) {
                  i = 10
                } else {
                  hetGetal = hetGetal.toString();
                  let hetGetal1;
                  let hetGetal2;
                  if (hetGetal < 10) {
                    hetGetal1 = 0;
                    hetGetal2 = parseInt(hetGetal.charAt(0));
                  } else {
                    hetGetal1 = parseInt(hetGetal.charAt(0));
                    hetGetal2 = parseInt(hetGetal.charAt(1));
                  }
                  this.bord.checkerPieces[hetGetal1][hetGetal2] = " "
                }
              }
              this.winnerCounter(this.bord.oldLetter);
            } else {
              for (let i = 1; i < 10; i++) {
                let reken = 11 * i;
                let hetGetal = +oldPosition + +reken;
                if (hetGetal == newPosition) {
                  i = 10
                } else {
                  hetGetal = hetGetal.toString();
                  let hetGetal1;
                  let hetGetal2;
                  if (hetGetal < 10) {
                    hetGetal1 = 0;
                    hetGetal2 = parseInt(hetGetal.charAt(0));
                  } else {
                    hetGetal1 = parseInt(hetGetal.charAt(0));
                    hetGetal2 = parseInt(hetGetal.charAt(1));
                  }
                  this.bord.checkerPieces[hetGetal1][hetGetal2] = " "
                }
              }
              this.winnerCounter(this.bord.oldLetter);
            }
          }
        }
      },
      smackThePiece(oldPosition, newPosition) {
        /**
        * berekend met de hulp van @var oldPostition en @var newPosition of er over een dam steen is heen geslagen en maakt dan de midelste leeg.
        * ook roept die als je slaat de @function winnerCounter(this.bord.oldLetter) die met de mee gekregen oude letter een punt upteld voor de winst
       */
        let middlePosition = null
        let newPositionRow = parseInt(newPosition.charAt(0));
        let newPositionCol = parseInt(newPosition.charAt(1));

        let oldPositionRow = parseInt(oldPosition.charAt(0));
        let oldPositionCol = parseInt(oldPosition.charAt(1));
        let colorNewPosition = this.bord.checkerPieces[oldPositionRow][oldPositionCol];
        // console.log(colorNewPosition);
        if (this.bord.youMaySmack) {
          let calculate = oldPosition - newPosition;
          if (calculate == 18) { // hij berekent het aan de hand van bv old = 45, nieuw = 27 er tussen is dan 36. old-nieuw= 18 of 22 dan de helft is midden
            middlePosition = (oldPosition - 9).toString();
            let middlePositionRow = parseInt(middlePosition.charAt(0));
            let middlePositionCol = parseInt(middlePosition.charAt(1));
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "dw") {
              this.bord.whiteDamCounter = this.bord.whiteDamCounter - 1;
            }
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "db") {
              this.bord.blackDamCounter = this.bord.blackDamCounter - 1;
            }
            this.bord.checkerPieces[middlePositionRow][middlePositionCol] = " ";
            this.winnerCounter(this.bord.oldLetter);
            this.sendBoardToServer();
            console.log(middlePosition)
          }

          if (calculate == 22) {
            middlePosition = (oldPosition - 11).toString();
            let middlePositionRow = parseInt(middlePosition.charAt(0));
            let middlePositionCol = parseInt(middlePosition.charAt(1));
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "dw") {
              this.bord.whiteDamCounter = this.bord.whiteDamCounter - 1;
            }
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "db") {
              this.bord.blackDamCounter = this.bord.blackDamCounter - 1;
            }
            this.bord.checkerPieces[middlePositionRow][middlePositionCol] = " ";
            this.winnerCounter(this.bord.oldLetter);
            this.sendBoardToServer();
          }

          if (calculate == -18) {          // hij berekent het aan de hand van bv old = 45, nieuw = 27 er tussen is dan 36. old-nieuw= 18 of 22 dan de helft is midden
            middlePosition = Math.abs(-oldPosition - 9).toString(); //Math.abs(- gebruiken we want -- wordt + maar + werkt niet idk 
            let middlePositionRow = parseInt(middlePosition.charAt(0));
            let middlePositionCol = parseInt(middlePosition.charAt(1));
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "dw") {
              this.bord.whiteDamCounter = this.bord.whiteDamCounter - 1;
            }
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "db") {
              this.bord.blackDamCounter = this.bord.blackDamCounter - 1;
            }
            this.bord.checkerPieces[middlePositionRow][middlePositionCol] = " ";
            this.winnerCounter(this.bord.oldLetter);
            this.sendBoardToServer();
          }
          if (calculate == -22) {
            middlePosition = Math.abs(-oldPosition - 11).toString();
            let middlePositionRow = parseInt(middlePosition.charAt(0));
            let middlePositionCol = parseInt(middlePosition.charAt(1));
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "dw") {
              this.bord.whiteDamCounter = this.bord.whiteDamCounter - 1;
            }
            if (this.bord.checkerPieces[middlePositionRow][middlePositionCol] == "db") {
              this.bord.blackDamCounter = this.bord.blackDamCounter - 1;
            }
            this.bord.checkerPieces[middlePositionRow][middlePositionCol] = " ";
            this.winnerCounter(this.bord.oldLetter);
            this.sendBoardToServer();
          }
        } else {
          // console.log("NO SMACKING")
          this.bord.keepGoing = false;
          this.sendBoardToServer();
        }
      },
      reapeatPosibileHitMoves(indexRow, indexCol, color){
        // this.bord.keepGoing = true;

        console.log(indexRow, indexCol, color);

        this.bord.selectedPiece = "" + indexRow + indexCol;
        this.bord.oldLetter = this.bord.checkerPieces[indexRow][indexCol];
        let checkLetter = "";
        let checkLetterKing = "";

        if (color == "b") {
          this.posibleRight = (this.bord.selectedPiece - 9).toString();
          this.posibleLeft = (this.bord.selectedPiece - 11).toString();
          this.posibleRightHit = (this.bord.selectedPiece - 18).toString();
          this.posibleLeftHit = (this.bord.selectedPiece - 22).toString();
          checkLetter = "w";
          checkLetterKing = "dw";
          this.posibleBackRight = Math.abs(-this.bord.selectedPiece - 9).toString();
          this.posibleBackLeft = Math.abs(-this.bord.selectedPiece - 11).toString();
          this.posibleBackRightHit = Math.abs(-this.bord.selectedPiece - 18).toString();
          this.posibleBackLeftHit = Math.abs(-this.bord.selectedPiece - 22).toString();
          this.sendBoardToServer();
        } else if (color == "w") {
          this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9).toString();
          this.posibleRight = Math.abs(-this.bord.selectedPiece - 11).toString();
          this.posibleLeftHit = Math.abs(-this.bord.selectedPiece - 18).toString();
          this.posibleRightHit = Math.abs(-this.bord.selectedPiece - 22).toString();
          checkLetter = "b";
          checkLetterKing = "db";
          this.posibleBackRight = (this.bord.selectedPiece - 9).toString();
          this.posibleBackLeft = (this.bord.selectedPiece - 11).toString();
          this.posibleBackRightHit = (this.bord.selectedPiece - 18).toString();
          this.posibleBackLeftHit = (this.bord.selectedPiece - 22).toString();
          this.sendBoardToServer();
        }

        let leftDigit1 = parseInt(this.posibleLeft.charAt(0)); //dit is voor zwart
        let leftDigit2 = parseInt(this.posibleLeft.charAt(1));
        let rightDigit1 = parseInt(this.posibleRight.charAt(0));
        let rightDigit2 = parseInt(this.posibleRight.charAt(1));

        let hitRight1 = parseInt(this.posibleRightHit.charAt(0));
        let hitRight2 = parseInt(this.posibleRightHit.charAt(1));
        let hitLeft1 = parseInt(this.posibleLeftHit.charAt(0));
        let hitLeft2 = parseInt(this.posibleLeftHit.charAt(1));


        let leftDigit1Back = parseInt(this.posibleBackLeft.charAt(0));
        let leftDigit2Back = parseInt(this.posibleBackLeft.charAt(1));
        let rightDigit1Back = parseInt(this.posibleBackRight.charAt(0));
        let rightDigit2Back = parseInt(this.posibleBackRight.charAt(1));

        let hitRight1Back = parseInt(this.posibleBackRightHit.charAt(0));
        let hitRight2Back = parseInt(this.posibleBackRightHit.charAt(1));
        let hitLeft1Back = parseInt(this.posibleBackLeftHit.charAt(0));
        let hitLeft2Back = parseInt(this.posibleBackLeftHit.charAt(1));

        if (this.posibleRight < 9) {
          console.log("We zijn aan het einde van het bord Rechts")
          rightDigit2 = rightDigit1
          rightDigit1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleLeft < 9) {
          console.log("We zijn aan het einde van het bord Links")
          leftDigit2 = leftDigit1
          leftDigit1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleRightHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN Rechts")
          hitRight2 = hitRight1
          hitRight1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleLeftHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN LInks")
          hitLeft2 = hitLeft1
          hitLeft1 = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRight < 9) {
          console.log("We zijn aan het einde van het bord Rechts")
          rightDigit2Back = rightDigit1Back
          rightDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeft < 9) {
          console.log("We zijn aan het einde van het bord Links")
          leftDigit2Back = leftDigit1Back
          leftDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRightHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN Rechts")
          hitRight2Back = hitRight1Back
          hitRight1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeftHit < 9) {
          console.log("We zijn aan het einde van het bord SLAAN LInks")
          hitLeft2Back = hitLeft1Back
          hitLeft1Back = 0
          this.sendBoardToServer();
        }

        if (this.posibleBackRight > 99) {
          console.log("posibleBackRight valt buiten bord")
          rightDigit2Back = 0
          rightDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeft > 99) {
          console.log("valt buiten bord")
          leftDigit2Back = 0
          leftDigit1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackRightHit > 99) {
          console.log("valt buiten bord")
          hitRight2Back = 0
          hitRight1Back = 0
          this.sendBoardToServer();
        }
        if (this.posibleBackLeftHit > 99) {
          console.log("posibleBackLeftHit valt buiten bord")
          hitLeft2Back = 0
          hitLeft1Back = 0
          this.sendBoardToServer();
        }

        if(this.bord.checkerPieces[rightDigit1][rightDigit2] == "b" || this.bord.checkerPieces[rightDigit1][rightDigit2] == "w"){
          if (this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetter && this.bord.checkerPieces[hitRight1][hitRight2] == " " ||
            this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetter && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " ||
            this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetter && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " ||
            this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetter && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " " ||

            this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetterKing && this.bord.checkerPieces[hitRight1][hitRight2] == " " ||
            this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetterKing && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " ||
            this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " ||
            this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " "
          ){       
            if (this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetter && this.bord.checkerPieces[hitRight1][hitRight2] == " " || this.bord.checkerPieces[rightDigit1][rightDigit2] == checkLetterKing && this.bord.checkerPieces[hitRight1][hitRight2] == " ") {
              this.bord.checkerPieces[hitRight1][hitRight2] = "rood"
              this.bord.youMaySmack = true;
              this.bord.redIsOnTheBoard = true;
              this.sendBoardToServer();
            }

            if (this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetter && this.bord.checkerPieces[hitLeft1][hitLeft2] == " " || this.bord.checkerPieces[leftDigit1][leftDigit2] == checkLetterKing && this.bord.checkerPieces[hitLeft1][hitLeft2] == " ") {
              this.bord.checkerPieces[hitLeft1][hitLeft2] = "rood"
              this.bord.youMaySmack = true;
              this.bord.redIsOnTheBoard = true;
              this.sendBoardToServer();
            }

            if (this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetter && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " " || this.bord.checkerPieces[rightDigit1Back][rightDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitRight1Back][hitRight2Back] == " ") {
              //acher slaan
              this.bord.checkerPieces[hitRight1Back][hitRight2Back] = "rood"
              this.bord.youMaySmack = true;
              this.bord.redIsOnTheBoard = true;
              this.sendBoardToServer();
            }

            if (this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetter && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " " || this.bord.checkerPieces[leftDigit1Back][leftDigit2Back] == checkLetterKing && this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] == " ") {
              //acher slaan
              this.bord.checkerPieces[hitLeft1Back][hitLeft2Back] = "rood"
              this.bord.youMaySmack = true;
              this.bord.redIsOnTheBoard = true;
              this.sendBoardToServer();
            }
          }else{
            console.log("STOOOOP")
            this.bord.keepGoing = false;
          }
        }else{

          // ---------------------------------------------------------------------------------------------------------------------------------------------------



        this.bord.selectedPiece = "" + indexRow + indexCol;
        this.bord.oldLetter = this.bord.checkerPieces[indexRow][indexCol];
        let checkLetter1 = "";
        let checkLetter2 = "";
        let keepGoingCounter = 0; //als deze 4 is dan kan je niet meer dus moet je  stoppen keepgoing moet false

        if (color == "db") {
          checkLetter1 = "w"; //zo weet die over welke stenen die wel mag slaan
          checkLetter2 = "dw";
          this.sendBoardToServer();
        } else if (color == "dw") {
          checkLetter1 = "b";
          checkLetter2 = "db";
        }
        let ThereHasBeenAHit = false;
        //linksachter
        for (let i = 1; i < 10; i++) {
          if (Math.abs(-this.bord.selectedPiece - 9 * i) > 99 || Math.abs(-this.bord.selectedPiece - 9 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9 * i).toString();

            let left1 = parseInt(this.posibleLeft.charAt(0));
            let left2 = parseInt(this.posibleLeft.charAt(1));
            if (this.bord.checkerPieces[left1][left2] == " ") {
              // this.bord.checkerPieces[left1][left2] = "rood";
              // this.bord.redIsOnTheBoard = true;
              keepGoingCounter++;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(-this.bord.selectedPiece - 9 * i) > 99 || Math.abs(-this.bord.selectedPiece - 9 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(-this.bord.selectedPiece - 9 * i).toString();
                  let left1 = parseInt(this.posibleLeft.charAt(0));
                  let left2 = parseInt(this.posibleLeft.charAt(1));
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //rechtsachter
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(-this.bord.selectedPiece - 11 * i) > 99 || Math.abs(-this.bord.selectedPiece - 11 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(-this.bord.selectedPiece - 11 * i).toString();
            let left1 = parseInt(this.posibleLeft.charAt(0));
            let left2 = parseInt(this.posibleLeft.charAt(1));
            if (this.bord.checkerPieces[left1][left2] == " ") {
              // this.bord.checkerPieces[left1][left2] = "rood";
              // this.bord.redIsOnTheBoard = true;
              keepGoingCounter++;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(-this.bord.selectedPiece - 11 * i) > 99 || Math.abs(-this.bord.selectedPiece - 11 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(-this.bord.selectedPiece - 11 * i).toString();
                  let left1 = parseInt(this.posibleLeft.charAt(0));
                  let left2 = parseInt(this.posibleLeft.charAt(1));
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    ThereHasBeenAHit = true;
                    this.bord.youMaySmackKing = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //linksvoor
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(this.bord.selectedPiece - 11 * i) > 99 || Math.abs(this.bord.selectedPiece - 11 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(this.bord.selectedPiece - 11 * i).toString();
            let left1;
            let left2;
            if (this.posibleLeft < 10) {
              left1 = 0;
              left2 = parseInt(this.posibleLeft.charAt(0));
            } else {
              left1 = parseInt(this.posibleLeft.charAt(0));
              left2 = parseInt(this.posibleLeft.charAt(1));
            }
            if (this.bord.checkerPieces[left1][left2] == " ") {
              // this.bord.checkerPieces[left1][left2] = "rood";
              // this.bord.redIsOnTheBoard = true;
              keepGoingCounter++;
              if (this.posibleLeft <= 11) {
                i = 10;
              }
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(this.bord.selectedPiece - 11 * i) > 99 || Math.abs(this.bord.selectedPiece - 11 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(this.bord.selectedPiece - 11 * i).toString();
                  if (this.posibleLeft < 9) {
                    left1 = 0;
                    left2 = parseInt(this.posibleLeft.charAt(0));
                    i = 10;
                  } else {
                    left1 = parseInt(this.posibleLeft.charAt(0));
                    left2 = parseInt(this.posibleLeft.charAt(1));
                  }
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        //rechtsvoor
        ThereHasBeenAHit = false;
        for (let i = 1; i < 10; i++) {
          if (Math.abs(this.bord.selectedPiece - 9 * i) > 99 || Math.abs(this.bord.selectedPiece - 9 * i) < 0) {
            i = 10;
          } else {
            this.posibleLeft = Math.abs(this.bord.selectedPiece - 9 * i).toString();
            let left1;
            let left2;
            if (this.posibleLeft < 10) {
              left1 = 0;
              left2 = parseInt(this.posibleLeft.charAt(0));
            } else {
              left1 = parseInt(this.posibleLeft.charAt(0));
              left2 = parseInt(this.posibleLeft.charAt(1));
            }
            if (this.bord.checkerPieces[left1][left2] == " ") {
              // this.bord.checkerPieces[left1][left2] = "rood";
              // this.bord.redIsOnTheBoard = true;
              keepGoingCounter++;
            } else if (this.bord.checkerPieces[left1][left2] == checkLetter1 || this.bord.checkerPieces[left1][left2] == checkLetter2) {
              //hier loop je tegen een tegenstander
              if (ThereHasBeenAHit) { //kijken of er al geslagen is want dan mag je niet door. anders ga je door
                i = 10;
              } else {
                i++; //1optellen
                if (Math.abs(this.bord.selectedPiece - 9 * i) > 99 || Math.abs(this.bord.selectedPiece - 9 * i) < 0) {  //kijken of het niet uit het bord gaat
                  i = 10; //anders einde oefening
                } else { //anders door
                  this.posibleLeft = Math.abs(this.bord.selectedPiece - 9 * i).toString();
                  if (this.posibleLeft < 10) {
                    left1 = 0;
                    left2 = parseInt(this.posibleLeft.charAt(0));
                  } else {
                    left1 = parseInt(this.posibleLeft.charAt(0));
                    left2 = parseInt(this.posibleLeft.charAt(1));
                  }
                  if (this.bord.checkerPieces[left1][left2] == " ") {
                    this.bord.checkerPieces[left1][left2] = "rood";
                    this.bord.redIsOnTheBoard = true;
                    this.bord.youMaySmackKing = true;
                    ThereHasBeenAHit = true;
                  } else { // er is al geslagen dus stop het.
                    i = 10;
                  }
                }
              }
            } else { //als je tegen je eigen gaat stop het
              i = 10;
            }
          }
        }
        if(keepGoingCounter == 4 && !this.bord.youMaySmack){
          this.bord.keepGoing = false;
        }
      }
      },
      changePieceToDam(indexRow, indexCol) {
        /**
        * kijkt nadat @function movePiece hem aanroept of de normalen damsteen al aan het einden van het bord is. 
        * zo ja verandert die het naar DamBlack ook wel db fo DamWhite ook wel dw
       */
        if (this.bord.checkerPieces[indexRow][indexCol] == "b" && indexRow == 0) {
          console.log("zwart is eind bord");
          this.bord.checkerPieces[indexRow][indexCol] = "db";
          this.bord.blackDamCounter += 1;
          this.sendBoardToServer();
        }
        if (this.bord.checkerPieces[indexRow][indexCol] == "w" && indexRow == 9) {
          console.log("wit is eind bord");
          this.bord.checkerPieces[indexRow][indexCol] = "dw";
          this.bord.whiteDamCounter += 1;
          this.sendBoardToServer();
        }
      },
      winnerCounter(color) {
        /**
         * krijgt van @function smackThePiece de letter die de andere letter heeft gesmackt
         * als dus kleur b is dan krijgt zwart een punt en anders white
        */
        if (color == "b" || color == "db") {
          this.bord.whitecounter += 1
          console.log("BlackSmackCounter:", this.bord.blackcounter)
          this.sendBoardToServer();
          if (this.bord.blackcounter == 20) {
            this.bord.winner = "Black"
          }
        } else if (color == "w" || color == "dw") {
          this.bord.blackcounter += 1
          console.log("WhiteSmackCounter:", this.bord.whitecounter)
          this.sendBoardToServer();
          if (this.bord.whitecounter == 20) {
            this.bord.winner = "White"
          }
        }
      },
      changeBlackTurn() {
        //hier wordt gekeken wie er aan de burt is (alleen doet dit natuurlijk nu nog niks maar zo kan het er uit zien)
        this.bord.whiteTurn = false;
        console.log("changeBlackTurn " + this.bord.whiteTurn);
        return this.bord.whiteTurn;
      },
      changeWhiteTurn() {
        this.bord.whiteTurn = true;
        console.log("changeWHITETurn " + this.bord.whiteTurn);
        return this.bord.whiteTurn;
      },
    }
  };
</script>
<style scoped>
  .piece {
    /* width: 40px;
    height: 40px; */
    width: 60px;
    height: 60px;
    /* border-radius: 50%; */
  }

  .white-piece {
    /* background-color: #ED135D; */
    content: "";
    background-image: url(/src/assets/ufoWhite.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .white-piece-dam {
    /* background-color: #ffe600; */
    content: "";
    background-image: url(/src/assets/rocketWhite.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
    margin-top: 4px;
  }

  .black-piece {
    /* background-color: #4B6ACC; */
    /* background-color: #000000; */
    content: "";
    background-image: url(/src/assets/ufoBlack.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .black-piece-dam {
    content: "";
    background-image: url(/src/assets/rocketBlack.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
    margin-top: 4px;
  }

  .rood {
    /* background-color: #a51f1f;
    border-radius: 94px; */
    width: 65px;
    height: 65px;
    content: "";
    background-image: url(/src/assets/circleBlue.png);
    background-size: 41px auto;
    background-repeat: no-repeat;
    background-position: center center;
  }

  /* not working */
  .roodRocket{ 
    content: "";
    background-image: url(/src/assets/redRocket.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
    margin-top: 4px;
  }

  .groen {
    /* border: 4px solid rgb(144, 255, 148); */
    content: "";
    background-image: url(/src/assets/greenUfo.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
  }

  .groenRocket{
    content: "";
    background-image: url(/src/assets/greenRocket.png);
    background-size: 60px auto;
    background-repeat: no-repeat;
    background-position: center center;
    margin-top: 4px;
  }
</style>