import { ref } from "vue";
import { defineStore } from "pinia";

export const useBordStore = defineStore("bord", () => {
  const checkerPieces = ref([
    ["x", "w", "x", "w", "x", "w", "x", "w", "x", "w"],
    ["w", "x", "w", "x", "w", "x", "w", "x", "w", "x"],
    ["x", "w", "x", " ", "x", " ", "x", " ", "x", " "],
    ["w", "x", "w", "x", "w", "x", "dw", "x", "w", "x"],

    ["x", " ", "x", " ", "x", " ", "x", " ", "x", " "], //test of " lege werkt" empty kan
    [" ", "x", " ", "x", " ", "x", "w", "x", " ", "x"],

    ["x", "b", "x", " ", "x", " ", "x", " ", "x", " "],
    ["b", "x", "b", "x", "db", "x", "b", "x", "b", "x"],
    ["x", "b", "x", "b", "x", "b", "x", "b", "x", "b"],
    ["b", "x", "b", "x", "b", "x", "b", "x", "b", "x"],
  ]);

  const selectedPiece = ref("");
  const oldLetter = ref("");
  const blackcounter = ref(0);
  const whitecounter = ref(0);
  const blackDamCounter = ref(0);
  const whiteDamCounter = ref(0);

  const youMaySmack = ref(false);
  const youMaySmackKing = ref(false);
  const redIsOnTheBoard = ref(false);
  const winner = ref("");

  const whiteTurn= ref(true);
  const eenmaligeCount = ref(0);
  // const whiteTurnLetter=ref("");
  // const whiteTurnLetterKing=ref("");
  const keepGoing= ref(true);

  function $reset() {
    checkerPieces.value = [
      ["x", "w", "x", "w", "x", "w", "x", "w", "x", "w"],
      ["w", "x", "w", "x", "w", "x", "w", "x", "w", "x"],
      ["x", "w", "x", "w", "x", "w", "x", "w", "x", "w"],
      ["w", "x", "w", "x", "w", "x", "w", "x", "w", "x"],

      ["x", " ", "x", " ", "x", " ", "x", " ", "x", " "], //test of " lege werkt" empty kan
      [" ", "x", " ", "x", " ", "x", " ", "x", " ", "x"],

      ["x", "b", "x", "b", "x", "b", "x", "b", "x", "b"],
      ["b", "x", "b", "x", "b", "x", "b", "x", "b", "x"],
      ["x", "b", "x", "b", "x", "b", "x", "b", "x", "b"],
      ["b", "x", "b", "x", "b", "x", "b", "x", "b", "x"],
    ];

    selectedPiece.value = "";
    oldLetter.value = "";
    blackcounter.value = 0;
    whitecounter.value = 0;
    blackDamCounter.value = 0;
    whiteDamCounter.value = 0;

    youMaySmack.value = false;

    redIsOnTheBoard.value = false;
    winner.value = "";
  }
  return {
    checkerPieces,
    selectedPiece,
    oldLetter,
    blackcounter,
    whitecounter,
    youMaySmack,
    youMaySmackKing,
    winner,
    blackDamCounter,
    whiteDamCounter,
    whiteTurn,
    keepGoing,
    eenmaligeCount,
    $reset,
  };
});
