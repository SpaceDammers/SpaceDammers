<template>
  <div class="smacked-pieces">
    <h1 class="title">Geslagen stenen</h1>
    <div class="smacked">
      <div class="smacked-piece">
        <div class="piece black-piece"></div>
        <p class="number">{{ bord.blackcounter }}</p>
      </div>
      <div class="smacked-piece">
        <div class="piece white-piece"></div>
        <p class="number">{{ bord.whitecounter }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { useBordStore } from "../../../stores/bord";
import io from "socket.io-client";
const socket = io("http://localhost:3000");
export default {
  name: "SmackedPieces",
  setup() {
    const bord = useBordStore();
    return { bord };
  },
};
</script>
<style lang="css" scoped>
.smacked-pieces {
  width: 349px;
  height: 145px;
  background: rgba(237, 19, 93, 0.25);
  border-radius: 19px;
  padding: 5px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

.title {
  font-family: sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  /* identical to box height */
  text-align: center;
  color: #ffffff;
  margin-bottom: 0;
}

.smacked {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 15px;
}

.smacked-piece {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.piece {
  width: 60px;
  height: 40px;
  /* border-radius: 50%; */
}

.white-piece {
  /* background-color: #ED135D; */
  /* background-color: #ffffff;    <img src="/src/assets/rocketOne.png" class="rocket rocket__2"> */

  content: "";
  background-image: url(/src/assets/ufoWhite.png);
  background-repeat: no-repeat;
    background-position: center center;
}

.white-piece-dam {
  background-color: #fff285;
}

.black-piece {
  /* background-color: #4B6ACC; */
  /* background-color: #000000; */
  content: "";
  background-image: url(/src/assets/ufoBlack.png);
  background-repeat: no-repeat;
    background-position: center center;
}

.number {
  padding-top: 8px;
  color: white;
}
</style>
