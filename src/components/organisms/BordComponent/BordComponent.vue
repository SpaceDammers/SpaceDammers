<template>
  <div>
    <div class="winscreen" v-if="this.bord.winner !== ''">
      <h1 class="title">{{this.bord.winner}} heeft gewonnen!</h1>
      <div class="btns">
        <button @click="resetGame();">Speel opnieuw</button>
        <button @click="goToMenu();">Terug naar menu</button>
      </div>
    </div>
    <div id="board">
      <div v-for="(row, indexRow) in bord.checkerPieces" :key="row" class="board-row">
        <square v-for="(squareContent, indexCol) in row" :squareContent="{ letter: squareContent, col: indexCol, row: indexRow }" @select-piece="handleSelectPiece(indexCol, indexRow)" />
      </div>
    </div>
  </div>
</template>
<script>
  import Square from "../../atoms/SquareComponent/Square.vue";
  import CheckerPiece from "../../atoms/CheckerPiece/CheckerPiece.vue";
  import { useBordStore } from "../../../stores/bord";
  import io from "socket.io-client";
  const socket = io("http://localhost:4000");

  export default {
    name: "BordComponent",
    components: { Square, CheckerPiece },
    setup() {
      const bord = useBordStore();
      return { bord };
    },
    data() {
      return {
        checkerPieces: this.bord.checkerPieces,
        
        winner: "",
        // blackcounter: 0,
        // whitecounter: 0,
      };
    },
    methods: {
     
      goToMenu() {
        this.$router.push("/");
      },
      resetGame() {
        socket.resetGame();
      }
    },
    created() {
      // Socket events
      // socket.on("play", (index) => {
      //   // console.log("kiekeboe index", index);
      //   this.bord.checkerPieces = index
      //   // winner = this.bord.winner
      // });
      socket.on("reset", () => {
        // console.log("clear");
        this.bord.$reset();
      });
    },
  };
</script>
<style scoped>


  #board {
    border: 1px solid #000000;
    display: flex;
    flex-wrap: wrap;
    width: 652px;
    /* width: 660px; */
    /* width: 500px; */
    /* height: 500px; */
    margin: 0 auto;
    box-sizing: border-box;
  }

  .board-row {
    display: flex;
    width: 100%;
    /* height: 50px; */
    height: 65px;
  }

  .winscreen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 500px;
    background-color: rgba(47, 233, 118, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .title {
    font-size: 2.3rem;
    color: #000;
    margin-bottom: 1rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }
</style>