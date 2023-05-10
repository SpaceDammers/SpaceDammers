<template>
  <main>
    <div class="top"> Tegenstander vs Tegenstander </div>
    <div class="row">
      <div class="left-side">
        <div class="scoreboard">
          <Scoreboard />
        </div>
        <div class="smacked-pieces">
          <SmackedPieces />
        </div>
        <div class="dam-counter">
          <DamCount />
        </div>
      </div>
      <div class="middle">
        <BordComponent />
      </div>
      <div class="right-side">
        <div class="buttons">
          <button @click="resetBoard()">Give up</button>
          <button @click="resetBoard()">Withdraw</button>
          <button @click="resetBoard()">Reset bord</button>
        </div>
        <Chat />
      </div>
    </div>
    <div class="row">
    </div>
  </main>
</template>
<script>
  import Scoreboard from '../components/organisms/Scoreboard/Scoreboard.vue';
  import SmackedPieces from '../components/organisms/SmackedPieces/SmackedPieces.vue';
  import DamCount from '../components/organisms/DamCount/DamCount.vue';
  import BordComponent from '../components/organisms/BordComponent/BordComponent.vue';
  import Chat from '../components/organisms/ChatComponent/Chat2.vue';
  import { useBordStore } from "../stores/bord";
  import SocketioService from "../services/socketio.service";

  export default {
    name: 'BoardView',
    components: { Scoreboard, SmackedPieces, DamCount, BordComponent, Chat },
    setup() {
      const bord = useBordStore();
      const socket = new SocketioService();
      return { bord, socket };
    },
    methods: {
      resetBoard() {
        // Reset game on server 
        this.socket.resetGame();

        // Reset bord on client
        this.bord.$reset();
      },
    },
    created() {
      // If the other player resets the game, reset the game on the client
      this.socket.onReset();
    }
  };
</script>
<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>