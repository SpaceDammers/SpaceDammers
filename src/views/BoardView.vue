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
        <div class="buttonWrap">
          <button @click="resetBoard(false)" class="buttons gray size">Give up</button>
          <button @click="resetBoard(false)" class="buttons gray size">Reset bord</button>
        </div>
        <button @click="resetBoard(false)" class="buttons gray size longButton">Withdraw</button>

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

  // import { useBordStore } from "../stores/bord";
  import io from "socket.io-client";
  const socket = io("http://localhost:3000");

  export default {
    name: 'BoardView',
    components: { Scoreboard, SmackedPieces, DamCount, BordComponent, Chat },
    // setup() {
    //   const bord = useBordStore();
    //   return { bord };
    // },
    // methods: {
    //   resetBoard(resetFromOther) {
    //     // Check eerst of dit bord wordt gereset door de andere speler
    //     if (!resetFromOther) {
    //       socket.emit("reset");
    //     }
    //     // Reset bord
    //     this.bord.$reset();
    //   },
    // }
  };
</script>
<style scoped>
.top{
  font-size: 20px;
    padding: 15px
}
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 93vh;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    height: 662px;
  }

  .middle{
  display: flex;
    justify-content: center;
    align-items: center;
}
.right-side{
  /* width: 20%;width: 350px; */
  width: 250px;
  display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 0.7rem;
}

.left-side{
  display: flex;
    justify-content: space-between;
    flex-direction: column;
    gap: 0.7rem;
}

.buttonWrap{
  display: flex;
  justify-content: space-between;
}
</style>