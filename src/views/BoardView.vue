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
          <button @click="resetBoard(false)">Give up</button>
          <button @click="resetBoard(false)">Withdraw</button>
          <button @click="resetBoard(false)">Reset bord</button>
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
  // import io from "socket.io-client";
  // const socket = io("http://localhost:3000");

  export default {
    name: 'BoardView',
    components: { Scoreboard, SmackedPieces, DamCount, BordComponent, Chat },
    setup() {
      const bord = useBordStore();
      const socket = new SocketioService();
      return { bord, socket };
    },
    methods: {
      resetBoard(resetFromOther) {
        // // Check eerst of dit bord wordt gereset door de andere speler
        if (!resetFromOther) {
          this.socket.resetGame();
        }
        // Reset bord
        this.bord.$reset();
      },
    },
    created() {
      // Onreset
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