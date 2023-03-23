<script lang="ts">
import ButtonComponent from "@/components/atoms/ButtonComponent/button.vue";
import InputComponent from "@/components/atoms/InputComponent/Input.vue";
import SocketioService from "@/services/socketio.service";

export default {
  name: "GamePinComponent",
  components: {
    ButtonComponent,
    InputComponent,
  },
  data() {
    return {
      pin: null,
      error: null,
      success: null,
    };
  },
  methods: {
    async sendPin() {
      this.error = null;
      if (this.pin === null) {
        this.error = "Please enter a pin";
        return;
      } else if (this.pin.length !== 4) {
        this.error = "Please enter a 4 digit pin";
        return;
      } else if (this.pin.includes(" ")) {
        this.error = "Please enter a 4 digit pin without spaces";
        return;
      } else {
        this.error = null;
        this.success = await new SocketioService().joinRoom(this.pin);
        if (this.success) {
          this.success = "Room joined successfully";
        } else {
          this.error = `Room ${this.pin} is full`;
        }
      }
    },
  },
};
</script>

<template>
  <div class="begin-game">
    <h1 class="title">SPACEDAMMERS</h1>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="success">Success: {{ success }}</div>
    <div class="game-pin">
      <h1 class="title">Enter Game Pin</h1>
      <div class="start">
        <InputComponent
          :placeholder="'_ _ _ _'"
          :class="'game-pin-input'"
          :orange="true"
          :max-characters="4"
          :min-characters="4"
          v-model="pin"
          @keydown.enter="sendPin"
        />
        <ButtonComponent :text="'Start game'" @click="sendPin" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/components/organisms/GamePinComponent/GamePinComponent.scss";
</style>
